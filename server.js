const express = require("express");
const app = express();

// Middleware to parse JSON request bodies
app.use(express.json());

// A simple function that checks if two date ranges intersect and calculates the overlap
function check_if_intersected(startDate1, endDate1, startDate2, endDate2) {
    const increaseDay = 86400000; // 1 day in milliseconds

    // Convert input dates to JavaScript Date objects
    let start1 = new Date(startDate1);
    let end1 = new Date(endDate1);
    let start2 = new Date(startDate2);
    let end2 = new Date(endDate2);

    // Convert Date objects to milliseconds
    let start1_msec = start1.getTime();
    let end1_msec = end1.getTime();
    let start2_msec = start2.getTime();
    let end2_msec = end2.getTime();

    let isIntersected;

    // [1] Invalid date range check
    if (start1_msec > end1_msec || start2_msec > end2_msec) {
        console.log("Not a valid date range");
        return { error: "Invalid date range" };
    } else {
        // [2] Two identical intervals
        if (start1_msec === start2_msec && end1_msec === end2_msec) {
            isIntersected = true;
            let overlapStart = new Date(start1_msec);
            let overlapEnd = new Date(end1_msec + increaseDay);
            let overlapDuration = calculateOverlapDuration(overlapStart,overlapEnd)
            return {
                    isIntersected,
                    overlap: {
                        start: overlapStart.toLocaleDateString(),
                        end: overlapEnd.toLocaleDateString()
                    },
                    duration: overlapDuration
                }
            };
        }

        // [3] No intersection
        if (start2_msec > end1_msec || start1_msec > end2_msec) {
            isIntersected = false;
            console.log("There is no intersection");
            return { isIntersected, overlap: null, duration: null };
        }

        // [4] There is an intersection
        isIntersected = true;

        // Calculate the overlap start and end dates
        let overlapStart = new Date(Math.max(start1_msec, start2_msec));
        let overlapEnd = new Date(Math.min(end1_msec, end2_msec) + increaseDay);

        // Calculate the overlap duration (years, months, days)
        let overlapDuration = calculateOverlapDuration(overlapStart, overlapEnd);

        // Return the result including the overlap start/end dates and the duration
        return {
            isIntersected,
            overlap: {
                start: overlapStart.toLocaleDateString(),
                end: overlapEnd.toLocaleDateString()
            },
            duration: overlapDuration
        };
    }


// Helper function to calculate the overlap duration in years, months, days
function calculateOverlapDuration(overlapStartDate, overlapEndDate) {
    let years = overlapEndDate.getFullYear() - overlapStartDate.getFullYear();
    let months = overlapEndDate.getMonth() - overlapStartDate.getMonth();
    let days = overlapEndDate.getDate() - overlapStartDate.getDate();

    // Adjust for negative months (crossing year boundary)
    if (months < 0) {
        years--;
        months += 12;
    }

    // Adjust for negative days (crossing month boundary)
    if (days < 0) {
        months--;
        let previousMonth = (overlapEndDate.getMonth() - 1 + 12) % 12;
        let daysInPreviousMonth = new Date(overlapEndDate.getFullYear(), previousMonth + 1, 0).getDate();
        days += daysInPreviousMonth;
    }

    return { years, months, days };
}

   






let storedDates = {};
// Route to handle POST requests to store data ============================================= 
app.post('/api/data', (req, res) => {
  
    const { startDate1, endDate1, startDate2, endDate2 } = req.body;

    let result = check_if_intersected(startDate1, endDate1, startDate2, endDate2)

    // Send a response back confirming data was received and stored
    res.json({ message: 'Data received and saved!', result });
     
   
   
  });



app.listen(3000, () => {
    console.log("Server is listening on port 3000");
});
