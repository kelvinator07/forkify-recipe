
export default class Likes {
    constructor() {
        this.likes = [];
    }

    addLike(id, title, author, image) {
        const like = {
            id,
            title,
            author,
            image
        }

        this.likes.push(like);

        // Persist Data to localStorage
        this.saveToLocalStorage();

        return like;
    }

    deleteLike (id) {
        const index = this.likes.findIndex(element => element.id === id);
        this.likes.splice(index, 1);

        // Persist Data to localStorage
        this.saveToLocalStorage();

    }

    isLiked (id) {
        return this.likes.findIndex(element => element.id === id) !== -1;
    }

    getNumberofLikes() {
        return this.likes.length;
    }

    saveToLocalStorage() {
        localStorage.setItem('likes', JSON.stringify(this.likes));
    }

    readFromLocalStorage() {
        const storage = JSON.parse(localStorage.getItem('likes'));
        if (storage) this.likes = storage;
    }

}