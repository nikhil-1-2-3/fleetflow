const token = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VySWQiOiI2YTc3NGY1NmVlYjAxYThmZDE3ZWE0YmQiLCJpYXQiOjE3ODYzODEzODAsImV4cCI6MTc4ODk3MzM4MH0.bkcUTqaf-LzAcehupI_6Bl4ZyZ8DEHSUQh_PT-ugLWc";
fetch("http://127.0.0.1:5000/api/bookings", {
    headers: {
        "Cookie": `jwt=${token}`
    }
}).then(r => r.json()).then(data => {
    console.log(JSON.stringify(data, null, 2));
}).catch(console.error);
