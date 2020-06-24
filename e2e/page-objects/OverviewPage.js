import BasePage from "./BasePage";
const config = require("../config/mainConfig.js");

const overviewElements= {
  ONCACBATLtable: 'h2=ONC-ACB and ONC-ATL Information',
  RowValue:'#acbAtlTable tbody tr',
  ColValue: '#acbAtlTable thead tr th'
}

class OverviewPage extends BasePage {
  open() {
    super.open(config.baseUrl);
  }

  get acbatlTable() {
    return $(overviewElements.ONCACBATLtable);
  }
  get acbatlTableRow(){
    return $$(overviewElements.RowValue);
  }
  get acbatlTableCol(){
    return $$(overviewElements.ColValue);
  }

  compareTableData(){
    this.acbatlTable.scrollIntoView();
        var rowcount=this.acbatlTableRow.length;
        var colcount=this.acbatlTableCol.length;
        var actualResult=[];
        for (var i=1; i<=rowcount;i++){
          for (var j=1; j<=colcount-2;j++){
            var cellvalue=$('#acbAtlTable tbody tr:nth-child('+i+') td:nth-child('+j+')').getText();
            actualResult.push(cellvalue);
          }
        }
        const ExpectedTableVlaues=['ONC-ACB', 'Drummond Group', 'ONC-ACB', 'ICSA Labs', 'ONC-ACB','SLI Compliance', 'ONC-ACB', 'UL LLC', 'ONC-ATL', 'Drummond Group', 'ONC-ATL', 'ICSA Labs', 'ONC-ATL', 'National Committee for Quality Assurance (NCQA)', 'ONC-ATL', 'SLI Compliance','ONC-ATL', 'UL LLC']
        var isSame=false;
        for ( var k=0;k<actualResult.length;k++){
          if(actualResult[k]==ExpectedTableVlaues[k]){
            isSame=true;
          }
        }
    return isSame;
  }
}

module.exports = new OverviewPage();
