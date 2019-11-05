const apiKey = "GGuhKLfx9dA6X1jS7FDQFdK8hqLI4N69aa5pyRlx";

const baseUrl = "https://developer.nps.gov/api/v1/parks";

function checkInput()
{

    $('.srchPark_btn').on('click', e =>
    {
        const stateCode = $('.state_code').val();
        const maxNum = $('.max_num').val();
        const stateArray = stateCode.split(',');
        let hasStateCode =  false;
        stateArray.forEach(elem => 
        {
            if(!STATES.find(e => e === elem))
            {
                hasStateCode =false;
            }
            else{
                hasStateCode =  true;
            }
        })
        if(stateCode === "" || maxNum <= 0  || !hasStateCode)
        {
            alert("WRONG INPUT/WRONG NUMBER");
        }
        
        else{
            e.preventDefault();
            getParks(stateCode,maxNum)
        }
    })
}

function formatQueryParam(param)
{
    const queryItems = Object.keys(param)
        .map(key => `${encodeURIComponent(key)}=${encodeURIComponent(param[key])}`);
    return queryItems.join('&');
}

function getParks(state_Code,maxNum)
{
   
    const params = {
        api_key: apiKey,
        stateCode: state_Code,
        limit: maxNum,
        fields: "addresses"
    };

    const queryString = formatQueryParam(params)
    const url = `${baseUrl}?${queryString}`;
    fetch(url)
        .then(Response =>{
            if(Response.ok)
            {
                return Response.json();
            }
            throw new Error(Response.statusText);
        })
        .then(ResponseJson =>{
            displayParks(ResponseJson);
        })
        .catch(err => {
            displayError(err);
        });


}

function findPhysicalAddress(arrayOfAddress)
{
    let physicalAddress = {};
    arrayOfAddress.map(elem =>
        {
            
            if(elem["type"] === "Physical")
            {
               
                physicalAddress = elem;
            }
        })
        return physicalAddress;
}

function displayParks(jsonObj)
{
    
    clearDisplay();
  
    jsonObj.data.forEach(elem =>
        {
            let physicalAddress = findPhysicalAddress(elem.addresses);
            $('.parks_list').append(
                `<li><h2>Park name: </h2>${elem.fullName}
                   <ul>
                        <li><h3>Park Description:</h3><p class="description">${elem.description}<p></li>
                        <li><h3>Park Website:</h3> <a href="${elem.url}">${elem.name}</a></li>
                        <li><h3>Park Address:</h3>${physicalAddress.line1}, ${physicalAddress.postalCode}, ${physicalAddress.stateCode}</li>
                </li>`
            )
        });
    $('.display').removeAttr('hidden');
}

function displayError(error)
{
    clearDisplay();
    $('.error_sect').append(`<h2 class="error_txt">Uh oh Something went wrong! ${error.message}</h2>`)
    $('.error_sect').removeAttr('hidden');
}

function clearDisplay()
{
    $('.parks_list').empty();
    $('.error_sect').empty();
}

$(checkInput());