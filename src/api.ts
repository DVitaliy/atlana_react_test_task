interface IErr {
  message: string
}

const getData = async <T>(endpoint: string, cb: (args: T) => void, err?: (args: string) => void): Promise<void> => {
  try {
    const response = await fetch(`https://api.github.com/${endpoint}`)
    const item: T & IErr = await response.json()

    const ratelimitReset: number = Number(response.headers.get("x-ratelimit-reset"))
    // const ratelimitRemaining = response.headers.get("x-ratelimit-remaining")
    if (response.ok) {
      cb(item)
    } else {
      let { message } = item
      switch (response.status) {
        case 403:
          message += `\nIt'll over at ${new Date(ratelimitReset * 1000)}`
          break
        case 404:
          message = "123"
          break
        case 422:
          message = "123"
          break
        default:
          throw new Error(`Unknow status: ${response.status}`)
      }
      throw new Error(message)
    }
  } catch (error) {
    if (err) err(String(error))
    console.error("getDataUserDetail", error)
  }
}
export default getData
/*
let timer: number | undefined
const arr: Array<[() => void, string, string]> = []

const iterator = () => {
  console.log("start iterator", arr)

  if (arr.length) {
    const next = arr.shift()

    // @ts-ignore
    const [target, thisArg, args] = next
    const [endpoint, cb, err] = args
    Reflect.apply(target, thisArg, [
      endpoint,
      (i: any) => {
        window.setTimeout(iterator, 1000)
        cb(i)
      },
      err
    ])
  }
}

export default new Proxy(getData, {
  apply(target, thisArg, args: keyof typeof getData) {
    // @ts-ignore
    arr.push([target, thisArg, args])
    // arr.push(() => Reflect.apply(target, thisArg, args))

    clearTimeout(timer)
    timer = window.setTimeout(iterator, 500)
  }
})
*/
