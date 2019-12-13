// Global variable: 
//        - containing the data from the csv file
//        - keep track of the last sort column and direction
//
var Data = new Array()
var sortMethode = { 'header': 'sur_name', 'direction': 1}

// Constructure for Issue Object
// 
function Issue (firstName, lastName, count, date){
    this.first_name    = firstName
    this.sur_name      = lastName
    this.issue_count   = count
    this.date_of_birth = date
}

// Function to sort data Ascending by string or by number
//
function sortData(){
    const {header, direction} = sortMethode
    if (header === 'first_name' || header === 'sur_name'){
        Data.sort((a, b) => { 
            const NameA = a[header].toUpperCase()
            const NameB = b[header].toUpperCase()
            if (NameA < NameB) {
                return -1 * direction
            }
            if (NameA > NameB) {
                return 1 * direction
            }
            return 0
        })
    } else {
        Data.sort((a,b) => {
            return (a[header] - b[header]) * direction
        })
    } 
    return Data
}

// Function to re-fill the tabel-body with sorted data
//
function fillTable(sortColumn){
    if (sortMethode.header === sortColumn) {
        if (sortMethode.direction === 1) {
            sortMethode.direction = -1
        } else {
            sortMethode.direction = 1
        }
    } else {
        sortMethode.header = sortColumn
        sortMethode.direction = 1    
    }
    sortData()

    const rows  = document.getElementById("tableBody").rows.length

    for (i = 0; i < rows; i++){
        const int2Date = new Date(Data[i].date_of_birth).toLocaleString("en-US", {year: 'numeric', month: 'numeric', day: 'numeric'})
        document.getElementById("tableBody").rows.item(i).cells.item(0).innerHTML = Data[i].first_name
        document.getElementById("tableBody").rows.item(i).cells.item(1).innerHTML = Data[i].sur_name
        document.getElementById("tableBody").rows.item(i).cells.item(2).innerHTML = Data[i].issue_count
        document.getElementById("tableBody").rows.item(i).cells.item(3).innerHTML = int2Date
    }
}

// Event trickered function, reads and stores CSV. Creates table
// 
document.getElementById("csvFile").addEventListener('change', function() {

    const fileRead = new FileReader();
    
    fileRead.onload = function () {
        const lines = this.result.split('\n')

        if (lines.length > 1) {

            let table = ['<table>']
            let i = 0

            lines.forEach(line => {       
                table.push['<thead><tr>']
                const elem = line.split(';')
                if (i === 0 ) {
                    elem.forEach(data => {
                        data = data.replace(/[\n\r]/g, '')
                        table.push(`<th onclick="fillTable('${data}')"> ${data} </th>`)
                    })
                    table.push('</tr></thead><tbody id="tableBody">')
                } else {
                    const date2Int = new Date(elem[3]).getTime()
                    const newIssue = new Issue(elem[0], elem[1], elem[2],date2Int)
                    Data.push(newIssue)
                }
                i++
            })

            const tableData = sortData()
            tableData.forEach(elem => {
                const int2Date = new Date(elem.date_of_birth).toLocaleString("en-US", {year: 'numeric', month: 'numeric', day: 'numeric'})
                table.push('<tr><td>' + elem.first_name + '</td> <td>' + elem.sur_name + '</td> <td>' + elem.issue_count + '</td> <td>' + int2Date + '</td></tr>')
            })
            table.push('</tbody></table>')
            document.getElementById('table').innerHTML = table.join('')
        }
    }
    fileRead.readAsText(this.files[0])
})