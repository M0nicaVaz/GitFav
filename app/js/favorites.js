import GithubUser from './GithubUser.js';

class Favorites {
  constructor(element) {
    this.root = document.querySelector(element);

    this.load();
  }

  load() {
    this.favoriteList =
      JSON.parse(localStorage.getItem('GithubFavorites')) || [];
  }

  save() {
    localStorage.setItem('GithubFavorites', JSON.stringify(this.favoriteList));
  }

  async add(username) {
    try {
      const doubledUser = this.favoriteList.find(
        (user) => user.login === username
      );

      if (doubledUser) {
        throw new Error('You already added this user!');
      }

      const user = await GithubUser.search(username);

      if (user.login === undefined) {
        throw new Error('User not found!');
      }

      this.favoriteList = [user, ...this.favoriteList];

      this.updateTable();
      this.save();
    } catch (error) {
      alert(error.message);
    }
  }

  delete(username) {
    const filteredList = this.favoriteList.filter(
      (user) => user.login !== username.login
    );
    this.favoriteList = filteredList;

    this.updateTable();

    this.save();
  }
}

export class FavoritesView extends Favorites {
  constructor(element) {
    super(element);

    this.tbody = this.root.querySelector('table tbody');

    this.handleClick();

    this.updateTable();
  }

  handleClick() {
    const inputBtn = document.querySelector('#search');

    inputBtn.onclick = () => {
      const { value } = document.querySelector('#username');
      this.add(value);
    };
  }

  updateTable() {
    this.resetTable();

    const tableIsEmpty = this.favoriteList.length < 1;

    tableIsEmpty ? this.updateEmptyTable() : this.updateUserEntries();
  }

  updateUserEntries() {
    this.favoriteList.forEach((user) => {
      const row = this.createUserRow(user);

      row.querySelector('.remove').onclick = () => {
        const canDelete = confirm('Are you sure?');
        if (canDelete) {
          this.delete(user);
        }
      };

      this.tbody.appendChild(row);
    });
  }

  updateEmptyTable() {
    const emptyRow = this.createEmptyRow();

    this.tbody.appendChild(emptyRow);
  }

  createUserRow(user) {
    const row = document.createElement('tr');

    row.innerHTML = `
    <td class="user">
      <img src="http://github.com/${user.login}.png"
       alt="foto de ${user.name}" />
      <a href="http://github.com/${user.login}">
        <p>${user.name}</p>
        <span>/${user.login}</span>
      </a>
    </td>
    <td class="repositories">${user.public_repos}</td>
    <td class="followers">${user.followers}</td>
    <td class="remove">&times;</td>
    `;

    return row;
  }

  createEmptyRow() {
    const emptyRow = document.createElement('tr');

    emptyRow.innerHTML = `
    <td class="empty-row">
      <img src="./app/assets/starface.svg" alt="star with a face" />
      <span>You don't have any favorites</span>
    </td>
     `;

    return emptyRow;
  }

  resetTable() {
    const rows = this.tbody.querySelectorAll('tr');

    rows.forEach((row) => {
      row.remove();
    });
  }
}
