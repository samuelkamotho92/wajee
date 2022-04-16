class Queryopertaions{
    //takes in the documents,querysting
    constructor(queryData,querystring){
this.queryData = queryData;
this.querystring = querystring
    }
    //filter
    filter(){
    const shallowQuery = { ...this.querystring };
        const specialQuery = ["sort","page","limit"];
    specialQuery.forEach(el=> delete shallowQuery[el]);
        console.log(req.query,shallowQuery);
        //advances filtering 
        let queryString = JSON.stringify(shallowQuery);
       queryString = queryString.replace(/\b(gte|gt|lte|lt)\b/g,match=>`$${match}`);
       this.queryData= this.queryData.find(JSON.parse(queryString));
       return this
    }
    sort(){
        if(this.querystring.sort){
            const sortBy = this.querystring.sort.split(",").join(" ");
          this.queryData = this.queryData.sort(sortBy);
        }else{
            this.queryData = this.queryData.sort("-createdAt");
        }
        return this
    }
    limit(){
        if(this.querystring.fields){
            const findOnly = this.querystring.fields.split(",").join(" ");
            this.queryData = this.queryData.select(findOnly)
        }else{
            this.queryData = this.queryData.select("-__v")
        }
        return this
    }
    pagination(){
        const page = this.querystring.page * 1 || 1;
const limit = this.querystring.limit * 1 || 100;
const skipped = (page-1) * limit;
this.queryData = this.queryData.skip(skipped).limit(limit);
return this
    }
}

module.exports = Queryopertaions;