// @ts-ignore
// this is just a mock library for testing
import localStorageMock from "localstorage"
import { getBookmarkPage, saveBookmarkPage } from "../bookmark"

global.localStorage = new localStorageMock()

describe("bookmark", () => {

    beforeEach(() => {
        localStorage.clear()
    })

    test("retrieves a number", () => {
        localStorage.store["test"] = "1"
        expect(typeof getBookmarkPage("test")).toBe("number")
    })

    test("retrieves a value even for missing key", () => {
      expect(typeof getBookmarkPage("random_key")).toBe("number")
    })

    test("returns 0 when key is missing", () => {
        expect(getBookmarkPage("random_key")).toBe(0)
    })

    test("retrieve a page number properly", () => {
        localStorage.store["a"] = "1"
        localStorage.store["b"] = "200"
        expect(getBookmarkPage("a")).toBe(1)
        expect(getBookmarkPage("b")).toBe(200)
    })

    test("saves new items properly", () => {
        saveBookmarkPage("a", 1)
        saveBookmarkPage("b", 200)
        expect(localStorage.store).toStrictEqual({
            a: "1",
            b: "200"
        })
    })

    test("overrides old items properly", () => {
        localStorage.store["a"] = "1"
        localStorage.store["b"] = "200"
        saveBookmarkPage("a", 2)
        expect(localStorage.store).toStrictEqual({
            a: "2",
            b: "200"
        })
    })
})