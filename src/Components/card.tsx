import { FC, useEffect, useState } from "react"
import { Link } from "@reach/router"
import { IUserDetails, IUserRepoDetails } from "../pages/details"
import getData from "../api"

interface ICard {
  user: IUserDetails
}
interface ICardRepo {
  repo: IUserRepoDetails
}

export const CardList: FC<ICard> = ({ user }) => {
  const { login, avatar_url } = user
  const [userRepos, setUserRepos] = useState<IUserDetails["public_repos"] | null | undefined>(undefined)

  useEffect(() => {
    const endpoint = `users/${login}`
    try {
      const storageUser = localStorage.getItem(endpoint)
      if (storageUser) {
        const data = JSON.parse(storageUser) as IUserDetails
        setUserRepos(data["public_repos"])
      } else {
        getData<IUserDetails>(
          endpoint,
          (item) => {
            localStorage.setItem(endpoint, JSON.stringify(item))
            setUserRepos(item["public_repos"])
          },
          () => setUserRepos(null)
        )
      }
    } catch {}
  }, [login])

  return (
    <div className="panel-block">
      <figure className="image is-32x32">
        <Link to={`u/${login}`}>
          <img src={`${avatar_url}&s=32`} alt={login} />
        </Link>
      </figure>
      <Link to={`u/${login}`} className="is-size-5 is-flex-grow-1 ml-5">
        {login}
      </Link>
      <div>
        Repo:{" "}
        {userRepos ?? (
          <span className="icon">
            {userRepos === undefined ? <i className="fas fa-spinner fa-pulse"></i> : <i className="fas fa-ban"></i>}
          </span>
        )}
      </div>
    </div>
  )
}

export const CardDetail: FC<ICard> = ({ user }) => {
  const { name, login, avatar_url, email, location, bio, followers, following, created_at } = user
  return (
    <article className="media p-3">
      <figure className="media-left">
        <p className="image is-128x128">
          <img src={`${avatar_url}&s=128`} alt={login} />
        </p>
      </figure>
      <div className="media-content">
        <div className="content">
          <p>
            <strong>{name || login}</strong>{" "}
            <small>
              @{login} {email}
            </small>
            <span className="tag is-pulled-right">{created_at}</span>
            <br />
            <small>{location}</small>
            <br />
            {bio}
          </p>
        </div>
        <nav className="level is-mobile">
          <div className="level-item has-text-centered">
            <div>
              <p className="heading">Following</p>
              <p className="title is-size-4">{following}</p>
            </div>
          </div>
          <div className="level-item has-text-centered">
            <div>
              <p className="heading">Followers</p>
              <p className="title is-size-4">{followers}</p>
            </div>
          </div>
        </nav>
      </div>
    </article>
  )
}

export const CardRepo: FC<ICardRepo> = ({ repo }) => {
  const { name, html_url, stargazers_count, forks_count } = repo
  return (
    <div className="panel-block">
      <a href={html_url} className="is-size-5 is-flex-grow-1" target="_blank" rel="noreferrer">
        {name}
      </a>
      <div>
        <div className="has-text-right">{forks_count} Forks</div>
        <div className="has-text-right">{stargazers_count} Stars</div>
      </div>
    </div>
  )
}
