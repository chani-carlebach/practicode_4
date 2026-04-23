import axios from 'axios';

// 1. הגדרת כתובת ה-API כברירת מחדל (Config Defaults)
// הוא ינסה לקחת מהענן, ואם לא ימצא (במחשב שלך) הוא ילך ל-localhost
const apiUrl = process.env.REACT_APP_API_URL || "http://localhost:5052";
axios.defaults.baseURL = apiUrl// 2. הוספת Interceptor לתפיסת שגיאות ב-Response ורישום ללוג
axios.interceptors.response.use(
    response => response, // אם התגובה תקינה, פשוט תחזיר אותה
    error => {
        // אם יש שגיאה, נרשום אותה ללוג כפי שהתבקשת
        console.error("Axios Interceptor caught an error:", error.response ? error.response.data : error.message);
        return Promise.reject(error);
    }
);

const service = {
    // שליפת כל המשימות
    getTasks: async () => {
        // בגלל ה-defaults, אין צורך לכתוב את כל הכתובת, רק את הנתיב
        const result = await axios.get(`/items`);
        return result.data;
    },

    // הוספת משימה
    addTask: async (taskName) => {
        const result = await axios.post(`/items`, {
            name: taskName,
            isComplete: false
        });
        return result.data;
    },

    // עדכון סטטוס משימה
    setCompleted: async (id, name, isComplete) => {
        await axios.put(`/items/${id}`, {
            id: id,
            name: name,
            isComplete: isComplete
        });
    },

    // מחיקת משימה
    deleteTask: async (id) => {
        await axios.delete(`/items/${id}`);
    }
};

export default service;