import { RouteComponentProps } from "@reach/router"
import { FC, Fragment, useEffect, useState } from "react"
import { CardList } from "../Components/card"
import Input from "../Components/input"
import { NotFound } from "../Components/notfound"
import { Error } from "../Components/error"
import { IUserDetails } from "./details"
import getData from "../api"

const Listing: FC<RouteComponentProps> = ({ uri, location }) => {
  const [responseErr, setResponseErr] = useState<string | null>(null)
  const [username, setUsername] = useState<string>(() => {
    return location ? decodeURIComponent(new URLSearchParams(location.search).get("q") ?? "") : ""
  })
  const [listUsers, setListusers] = useState<IUserDetails[] | null>([])

  useEffect(() => {
    if (username) {
      const endpoint = `q=${username}`
      try {
        const storage = localStorage.getItem(endpoint)
        if (storage) {
          const items = JSON.parse(storage) as IUserDetails[]
          setListusers(items.length ? items : null)
        } else {
          getData<{ items: IUserDetails[] }>(
            `search/users?${endpoint}`,
            (data) => {
              const items = data.items as IUserDetails[]
              localStorage.setItem(endpoint, JSON.stringify(items))
              setListusers(items.length ? items : null)
            },
            (err) => {
              setResponseErr(err)
            }
          )
        }
      } catch (error) {
        console.error(error)
      }
    } else {
      setListusers([])
    }
  }, [username])

  useEffect(() => {
    return () => setResponseErr(null)
  }, [])

  if (responseErr) return <Error>{responseErr}</Error>

  return (
    <Fragment>
      <Input placeholder="Search for Users" path={uri ?? "/"} setvalue={setUsername} />

      {listUsers && listUsers.map((user) => <CardList key={user.id} user={user} />)}

      {username && listUsers === null && <NotFound />}
    </Fragment>
  )
}
export default Listing
