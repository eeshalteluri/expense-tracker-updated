function getCookie(name) {
    console.log(name)
    let cookieArr = document.cookie.split(";");
    console.log("cookieArr: ", cookieArr)
    
    for(let i = 0; i < cookieArr.length; i++) {
        let cookiePair = cookieArr[i].split("=");
        console.log("cooke pair: ", cookiePair)
        
        if(name === cookiePair[0].trim()) {
            console.log(cookiePair[1])
            return decodeURIComponent(cookiePair[1]);
        }
    }
    
    return null;
}
export default getCookie