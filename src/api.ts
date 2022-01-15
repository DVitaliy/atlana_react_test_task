interface IErr {
  message: string
}

export const getData = async <T>(
  endpoint: string,
  cb: (args: T) => void,
  err?: (args: string) => void
): Promise<void> => {
  try {
    const response = await fetch(`https://api.github.com/${endpoint}`)
    const item: T & IErr = await response.json()

    switch (response.status) {
      case 200:
        cb(item)
        break
      case 403:
      case 404:
        const { message } = item
        throw new Error(message)
      default:
        throw new Error(`Unknow status: ${response.status}`)
    }
  } catch (error) {
    if (err) err(String(error))
    console.error("getDataUserDetail", error)
  }
}
