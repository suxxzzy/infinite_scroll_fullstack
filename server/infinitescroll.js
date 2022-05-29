const postList = require('./src/dummy')


module.exports = (req,res) =>  {
    try{
        console.log(`무한스크롤 요청 들어옴`)
        const {page} = req.query;
        if(!page){
            return res.status(400).json({message:'query parameter not provided!'})
        }
        console.log(`클라이언트에서 요청한 페이지 번호`,page)
        //그 외의 경우: offset, limit 8으로 해서 8개씩 끊어서 데이터를 보내준다.
        const newPage = postList.filter(el => el.page === parseInt(page))
        console.log(newPage,"보내줄 데이터")
        return res.status(200).json({data: {page: newPage}, message: `${page}페이지 게시물을 가져왔습니다`})
    }catch(e){
        return res.status(500).json({message:'server error'})
    }
}