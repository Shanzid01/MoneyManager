export default{
    getDateNow(today = new Date()){
        var dd = String(today.getDate()).padStart(2, '0');
        var mm = String(today.getMonth()).padStart(2, '0');
        var yyyy = today.getFullYear();
        const monthNames = ["January", "February", "March", "April", "May", "June",
            "July", "August", "September", "October", "November", "December"
        ];

        today = `${monthNames[Number(mm)]} ${dd}, ${yyyy}`;
        return today;
    },
    parseDate(dateString){
        let lt= new Date(dateString);
        return this.getDateNow(lt);
    },
    getDateRange(start, end) {
        for(var arr=[],dt=start; dt<=end; dt.setDate(dt.getDate()+1)){
            arr.push(new Date(dt));
        }
        let transformed=[];
        for(let i in arr){
            transformed.push(this.getDateNow(arr[i]))
        }
        return transformed;
    }
}