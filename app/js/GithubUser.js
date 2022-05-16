export default class GithubUser {
  static async search(user) {
    const endpoint = `https://api.github.com/users/${user}`;

    const data = await fetch(endpoint);

    const { login, name, followers, public_repos } = await data.json();

    return {
      login,
      name,
      followers,
      public_repos,
    };
  }
}
