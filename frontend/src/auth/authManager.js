
const isAuthed = (error) => {
    const token = window.localStorage.getItem("token");
    if(token){
        return true
    }
    return false
};

export { isAuthed };
