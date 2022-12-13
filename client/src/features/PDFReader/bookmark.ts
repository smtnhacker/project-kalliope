export type BookHash = string
export type PageNumber = number

export function getBookmarkPage(bookHash: BookHash): PageNumber {
    return parseInt(localStorage.getItem(bookHash) ?? "0")
}

export function saveBookmarkPage(bookHash: BookHash, numPage: PageNumber): void {
    localStorage.setItem(bookHash, numPage.toString())
}