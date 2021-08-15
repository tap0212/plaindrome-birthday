import "../css/styles.css";
import moment from "moment";
import calendarVideo from "../assets/calendar.mp4";
import successVideo from "../assets/success.mp4";
import loadingVideo from "../assets/loading.mp4";

const stringReversal = (str) => str.split("").reverse().join("");

const isAPalindrome = (str) => str === stringReversal(str);

const getDateAsString = (date) => {
    const stringifiedDate = {};
    date.day < 10
        ? (stringifiedDate.day = `0${date.day}`)
        : (stringifiedDate.day = date.day.toString());
    date.month < 10
        ? (stringifiedDate.month = `0${date.month}`)
        : (stringifiedDate.month = date.month.toString());

    stringifiedDate.year = date.year.toString();
    return stringifiedDate;
};

const getDateInAllFormatsOfDate = (date) => {
    const dateObj = new Date(`${date.day}/${date.month}/${date.year}`);
    const formats = [
        "DDMMYYYY",
        "MMDDYYYY",
        "YYYYMMDD",
        "DDMMYY",
        "MMDDYY",
        "YYDDMM",
    ];
    return formats.map((d) => moment(dateObj).format(d));
};

const checkPalindromeForAllDateFormats = (date) => {
    const dateInAllFormats = getDateInAllFormatsOfDate(date);
    const palindromeList = [];

    for (let i = 0; i < dateInAllFormats.length; i++) {
        palindromeList.push(isAPalindrome(dateInAllFormats[i]));
    }
    return palindromeList;
};

const getNextDate = (date) => {
    const newDate = moment(
        `${date.day}/${date.month}/${date.year}`,
        "DDMMYYYY"
    ).add(1, "days");
    return {
        day: newDate.format("DD"),
        month: newDate.format("MM"),
        year: newDate.format("YYYY"),
    };
};
const getPreviousDate = (date) => {
    const newDate = moment(
        `${date.day}/${date.month}/${date.year}`,
        "DDMMYYYY"
    ).subtract(1, "days");
    return {
        day: newDate.format("DD"),
        month: newDate.format("MM"),
        year: newDate.format("YYYY"),
    };
};
const getNextPalindromeDate = (date) => {
    let nextDate = getNextDate(date);
    let ctr = 0;

    while (1) {
        ctr++;
        const resultList = checkPalindromeForAllDateFormats(
            getDateAsString(nextDate)
        );
        for (let i = 0; i < resultList.length; i++) {
            if (resultList[i]) {
                return [ctr, nextDate];
            }
        }
        nextDate = getNextDate(nextDate);
    }
};

function getPreviousPalindromeDate(date) {
    let previousDate = getPreviousDate(date);
    let days = 0;

    while (1) {
        days++;
        const resultList = checkPalindromeForAllDateFormats(
            getDateAsString(previousDate)
        );

        for (let i = 0; i < resultList.length; i++) {
            if (resultList[i]) {
                return [days, previousDate];
            }
        }
        previousDate = getPreviousDate(previousDate);
    }
}

(() => {
    document.getElementById("button").addEventListener("click", () => {
        const dob = document.getElementById("dob-input").value;
        const errorEl = document.getElementById("error-dob");
        const statusEl = document.getElementById("status");
        const videoEl = document.getElementById("video");
        errorEl.innerText = "";
        statusEl.innerText = "";
        if (!dob) {
            errorEl.innerText = "Please choose a valid date first!";
            return;
        }

        const dateObj = {
            day: Number(dob.split("-")[2]),
            month: Number(dob.split("-")[1]),
            year: Number(dob.split("-")[0]),
        };
        const list = checkPalindromeForAllDateFormats(getDateAsString(dateObj));
        let isPalindrome = false;

        for (let i = 0; i < list.length; i++) {
            if (list[i]) {
                isPalindrome = true;
                break;
            }
        }
        videoEl.setAttribute("src", loadingVideo);

        setTimeout(() => {
            if (isPalindrome) {
                videoEl.setAttribute("src", successVideo);
                statusEl.innerText = "Yay! Your birthday is palindrome!";
            } else {
                videoEl.setAttribute("src", calendarVideo);
                const [palindromeAfterDays, nextDate] =
                    getNextPalindromeDate(dateObj);
                const [palindromeBeforeDays, prevDate] =
                    getPreviousPalindromeDate(dateObj);
                if (palindromeAfterDays > palindromeBeforeDays) {
                    statusEl.innerText = `The nearest palindrome date is ${prevDate.day}/${prevDate.month}/${prevDate.year}, you missed by ${palindromeBeforeDays} days.`;
                } else {
                    statusEl.innerText = `The nearest palindrome date is ${nextDate.day}/${nextDate.month}/${nextDate.year}, you missed by ${palindromeAfterDays} days.`;
                }
            }
        }, 2000);
    });
})();
