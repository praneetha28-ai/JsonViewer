function getDataAndCreateTree(data,index)
{
    const xmlDocument = new DOMParser().parseFromString(data,"text/xml")
    let treeHTML = '<ul>';
    var tree = buildTree(xmlDocument.documentElement.childNodes[index]);
    tree += '</ul>';
    var docTree = document.getElementById("tree");
    docTree.innerHTML = tree;
    function buildTree(node) 
    {
        // console.log(node);
        treeHTML += '<li style="color: blue;"><span class="caret">' + node.nodeName+'</span>';
        if(node.hasChildNodes)
        {
            treeHTML+= '<ul class="nested">';
            for(var i = 0;i<node.childNodes.length;i++)
            {       
                var childNode = node.childNodes[i];
                if(childNode.nodeType==1)
                {
                    var newTree = buildTree(childNode);        
                }
                else if(childNode.nodeType==3)
                {
                    treeHTML+= childNode.nodeValue;
                }
            }
            treeHTML+= '</ul>';
            treeHTML+='</li>';
        }
        return treeHTML;
    }
    var toggle = document.getElementsByClassName("caret");
    for(var i = 0;i<toggle.length;i++)
    {
        toggle[i].addEventListener('click',
        function () 
        {
            var nested = this.parentElement.querySelector('.nested');
            if (nested) {
                nested.classList.toggle("active");
                console.log(nested);
            }
            this.classList.toggle('caret-down');
        })
    }
}
function getIdentifierList(data) 
{
    const xmlDocument = new DOMParser().parseFromString(data,"text/xml");
    function buildOptions(node)
    {
        var optionsList = document.getElementById("identifierList");

        if(node.hasChildNodes)
        {
            // var option = "";
            for(var i =1;i<node.childNodes.length;i+=2)
            {   
                const liElement = document.createElement('li');
                const anchorElement = document.createElement('a');
                anchorElement.classList.add('dropdown-item');
                anchorElement.href ='#';
                anchorElement.id = i;
                anchorElement.textContent = node.childNodes[i].getElementsByTagName('identifier')[0].textContent;
                liElement.appendChild(anchorElement);
                optionsList.appendChild(liElement);
                // console.log(node.childNodes[i].getElementsByTagName('identifier')[0].textContent);
                // option += '<li>'+node.childNodes[i].getElementsByTagName('identifier')[0].textContent+'</li>';
            }
            document.querySelectorAll("#identifierList .dropdown-item").forEach(item=>{
                item.addEventListener('click',event=>{
                    var optionbtn = document.getElementById("optionButton");
                    optionbtn.innerHTML = event.target.innerText;
                    var id = event.target.id;
                    console.log(id);
                    getDataAndCreateTree(data,id);
                })
            })
        }
        // console.log(option);
        // return option;
    }
    buildOptions(xmlDocument.documentElement);
    // console.log(tree);
    // var list = document.getElementById("identifierList");
    // list.append(tree.innerHTML);
}
function searchID()
{
    var inputWord = document.getElementById("searchforId").value;
    var searchWord = inputWord.toUpperCase();
    var fromListCountries = document.getElementById("identifierList");
    var listElements = fromListCountries.getElementsByTagName('li');
    for (i = 1; i < listElements.length; i++) {
        a = listElements[i].getElementsByTagName("a")[0];
        txtValue = a.innerText;
        if (txtValue.toUpperCase().startsWith(searchWord) ) {
            listElements[i].style.display = "";
        } else {
            listElements[i].style.display = "none";
        }
      }
}

document.querySelector('form').addEventListener('submit', function(e) {
    e.preventDefault(); // Prevent the form from submitting normally

    var formData = new FormData();
    var fileInput = document.querySelector('input[type="file"]');
    formData.append('fileinput', fileInput.files[0]);

    var xhttp = new XMLHttpRequest();
    xhttp.onreadystatechange = function() {
        if (this.readyState == 4 && this.status == 200) {
            var data = xhttp.responseText;
            // Process the response data here
            console.log(data)
            if(data=="incorrect file")
            {
                Swal.fire
                (
                    {
                        title:"This type of file is not supported",
                        icon:"info",
                        text:"Please Upload XML Files Only",
                        confirmButtonColor: "#40a2af",                        
                    }
                )
            }
            else if(data=="no files")
            {
                Swal.fire
                (
                    {
                        title:"Please Upload File",
                        icon:"warning",
                        text:"Please Upload XML Files Only",
                        confirmButtonColor: "#40a2af",
                    }
                )
            }
            else
            {
                getIdentifierList(data);
                Swal.fire(
                    {
                        title:"File Upload Success",
                        icon: "success",
                        confirmButtonColor: "#40a2af",
                    }
                );
                console.log(data);
            } 
        }
    };
    xhttp.open("POST", "treejson.php", true);
    xhttp.send(formData);
});
