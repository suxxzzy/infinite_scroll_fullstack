import React, { useState, useCallback, useEffect } from "react";
import styled from "styled-components";
import axios from "axios";

const InfiniteScroll = () => {
  const [page, setPage] = useState(1); //기본 1페이지부터 먼저 보여줘야 한다
  const [posts, setPosts] = useState([]);
  const [total, setTotal] = useState(0);

  //클라이언트가 서버에게 검색결과 보여달라고 요청 전송한다(마지막 사진 클릭 시점)
  //=> 기본 1페이지에 대한 결과물 전송해야 한다. 검색 api는 /?size=1&space=2&species=3&page=1 이렇게 된다.
  useEffect(() => {
    axios.get(`http://127.0.0.1:4000/?page=1`).then((res) => {
      console.log(res.data, "서버에서 받은 1페이지 데이터");
      setPosts(posts.concat(res.data.data.page));
      setTotal(res.data.data.total); //서버가 보유한 총 데이터 개수
      setPage(page + 1); //다음 페이지 세팅
    });
  }, []);

  //2페이지부터는 스크롤을 바닥까지 내려야만 한다.

  //스크롤 이벤트 시 실행할 함수
  const handleScroll = useCallback(() => {
    const { innerHeight } = window;
    const { scrollHeight } = document.body;
    const { scrollTop } = document.documentElement;
    if (
      Math.round(scrollTop + innerHeight) >= scrollHeight &&
      posts.length < total
    ) {
      //스크롤이 화면의 가장 바닥에 닿았을 경우&& 아직 전체 다 안 받았을 경우, 서버로부터 추가 데이터를 받아오도록 한다
      console.log(`현재 페이지 번호는 ${page}입니다`);
      axios.get(`http://127.0.0.1:4000/?page=${page}`).then((res) => {
        console.log(res.data, "서버에서 받은 데이터");
        setPosts(posts.concat(res.data.data.page)); //새로운 페이지배열을 받아오도록 요청.
        setTotal(res.data.data.total); //서버가 보유한 총 데이터 개수
        setPage(page + 1); // 페이지 수 증가
      });
    }
  }, [page, posts, total]);

  useEffect(() => {
    window.addEventListener("scroll", handleScroll, true);

    return () => {
      window.removeEventListener("scroll", handleScroll, true);
    };
  }, [handleScroll]);

  return (
    <Container>
      {posts.map((post, idx) => (
        <PostItem key={idx}>{post.contents}</PostItem>
      ))}
    </Container>
  );
};

export default InfiniteScroll;

const Container = styled.div`
  width: 100%;
  max-width: 1000px;
  margin: 4rem auto;
`;

const PostItem = styled.div`
  width: 100%;
  height: 350px;
  border: 2px solid black;
`;
