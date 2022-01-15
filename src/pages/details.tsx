import { RouteComponentProps } from "@reach/router"
import { FC, Fragment, useEffect, useState } from "react"
import { CardDetail, CardRepo } from "../Components/card"
import Input from "../Components/input"
import { Loading } from "../Components/loading"
import { NotFound } from "../Components/notfound"
import { getData } from "../api"

export interface IUserDetails {
  id: string
  login: string
  avatar_url: string
  name: string | null
  email: string | null
  location: string
  created_at: string
  bio: string | null
  followers: number
  following: number
  public_repos: number
}
export interface IUserRepoDetails {
  id: string
  name: string
  html_url: string
  stargazers_count: number
  forks_count: number
}

interface IDetailsProps extends RouteComponentProps {
  login?: string
}

const Details: FC<IDetailsProps> = ({ login, uri, location }) => {
  const [userDetail, setUserDetail] = useState<IUserDetails | null>(null)
  const [userRepoList, setUserRepoList] = useState<IUserRepoDetails[] | null>(null)
  const [repoName, setRepoName] = useState<string>(() => {
    return location ? decodeURIComponent(new URLSearchParams(location.search).get("q") ?? "") : ""
  })

  // Get user data
  useEffect(() => {
    const endpoint = `users/${login}`
    try {
      const storageUser = localStorage.getItem(endpoint)
      if (storageUser) setUserDetail(JSON.parse(storageUser))
      else {
        getData<IUserDetails>(
          endpoint,
          (item) => {
            localStorage.setItem(endpoint, JSON.stringify(item))
            setUserDetail(item)
          },
          (err) => {
            alert(err)
          }
        )
      }
    } catch {}
  }, [login])

  // Get user's repo data
  useEffect(() => {
    if (userDetail) {
      const endpoint = encodeURIComponent(`${repoName} user:${login}`)
      try {
        const storageRepo = localStorage.getItem(endpoint)
        if (storageRepo) {
          const items = JSON.parse(storageRepo) as IUserRepoDetails[]
          setUserRepoList(items.length ? items : null)
        } else {
          getData<{ items: IUserRepoDetails[] }>(
            `search/repositories?q=${endpoint}`,
            (data) => {
              const items = data.items as IUserRepoDetails[]
              localStorage.setItem(endpoint, JSON.stringify(items))
              setUserRepoList(items.length ? items : null)
            },
            (err) => {
              alert(err)
            }
          )
        }
      } catch {}
    }
  }, [login, userDetail, repoName])

  return (
    <Fragment>
      {userDetail ? <CardDetail user={userDetail} /> : <Loading />}
      <Input
        placeholder="Search for User's Repositories"
        path={uri ?? `/u/${login}`}
        setvalue={setRepoName}
        disabled={!userDetail}
      />
      {userRepoList && userRepoList.map((repo) => <CardRepo key={repo.id} repo={repo} />)}

      {userDetail && repoName && userRepoList === null && <NotFound />}
    </Fragment>
  )
}
export default Details
