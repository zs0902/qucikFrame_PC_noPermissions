const tableToExcel = function(){
    //要导出的json数据
    const jsonData = [
      {
        name:'路人甲',
        phone:'123456789',
        email:'000@123456.com'
      },
      {
        name:'炮灰乙',
        phone:'123456789',
        email:'000@123456.com'
      },
      {
        name:'土匪丙',
        phone:'123456789',
        email:'000@123456.com'
      },
      {
        name:'流氓丁',
        phone:'123456789',
        email:'000@123456.com'
      },
    ]
    //列标题，逗号隔开，每一个逗号就是隔开一个单元格
    let str = `姓名,电话,邮箱\n`;
    //增加\t为了不让表格显示科学计数法或者其他格式
    for(let i = 0 ; i < jsonData.length ; i++ ){
      for(let item in jsonData[i]){
          str+=`${jsonData[i][item] + '\t'},`;     
      }
      str+='\n';
    }
    //encodeURIComponent解决中文乱码
    let uri = 'data:text/csv;charset=utf-8,\ufeff' + encodeURIComponent(str);
    //通过创建a标签实现
    let link = document.createElement("a");
    link.href = uri;
    //对下载的文件命名
    link.download =  "json数据表.csv";
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  }

export default tableToExcel


/**
 * 以下是实际项目，根据表格结构导出数据
 */

 //要导出的json数据
//  const table_data = content.columns
//  const api_data = content.apiData
//  //列标题，逗号隔开，每一个逗号就是隔开一个单元格
//  let str = '';
//  let field_arr = []
//  table_data.forEach((item, index) => {
//    str += index==table_data.length-1?item.title+'\n':item.title+','
//    field_arr.push(item.field)
//  })

//  console.log("field_arr:",field_arr,str)
 
//  //增加\t为了不让表格显示科学计数法或者其他格式
//  for(let i = 0 ; i < api_data.length ; i++ ){
//    table_data.forEach(item => {
//      for(let key in api_data[i]){
//        if(key == item.field)
//          str+=`${api_data[i][key] + '\t'},`;     
//      }
//    })
//    str+='\n';
//  }
//  //encodeURIComponent解决中文乱码
//  let uri = 'data:text/csv;charset=utf-8,\ufeff' + encodeURIComponent(str);
//  //通过创建a标签实现
//  let link = document.createElement("a");
//  link.href = uri;
//  //对下载的文件命名
//  link.download =  "json数据表.csv";
//  document.body.appendChild(link);
//  link.click();
//  document.body.removeChild(link);