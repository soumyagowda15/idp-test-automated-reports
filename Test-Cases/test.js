const translate = require('translate-google')
var moment = require("moment");
describe("test",async function(){
 it("test",async function(){

let res= await translate('9 tháng 1 năm 2021', {to: 'en'});
console.log(res)
var date = isDate(res);
if (date==true)
{
    console.log(date);
} 

})
})

function isDate(val) {
    var d = new Date(val);
    return !isNaN(d.valueOf());
}