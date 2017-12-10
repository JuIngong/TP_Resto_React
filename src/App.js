import React, { Component } from 'react';
import './App.css';

// Composant fonctionnel
function Resto(props) {
    return(
      <tr>
        <td data-th="Nom">{props.resto.name}</td>
        <td data-th="Cuisine">{props.resto.cuisine}</td>
      </tr>
    )
}

class Pagi extends Component {
  constructor(props) {
    super(props);
    this.pagi = this.pagi.bind(this); 

    this.state = {
      pages : []
    };
  }

  componentWillMount(){
    this.pagi(this.props.page);
  }

  componentWillReceiveProps(nextProps) {
    console.log(nextProps)
    if (this.props.page !== nextProps.page || this.props.numPages !== nextProps.numPages) {
      this.props = nextProps;
      this.pagi(nextProps.page);
    }
  }

  pagi(page) {
    let tot = this.props.numPages;
    let active;
    let pageCutLow = page - 1;
    let pageCutHigh = page + 1;
    let tpages = []
    // affichage de previous /disable

    if (page > 0) {
      tpages.push({
          'val': (page - 1),
          'txt': 'Previous',
          'class': 'previous no'
        })
      
    } else {
      tpages.push({
          'val': 0,
          'txt': 'Previous',
          'class': 'previous no disable'
        })
    }
    // pas de boucle si moi de 6 elements
    if (tot < 6) {
      for (let p = 0; p <= tot; p++) {
        active = page == p ? "active" : "no";
        tpages.push({
            'val': p,
            'txt': '' + (p + 1),
            'class': active
        
        })
        
      }
    }
    // sinon on va faire le traitement 
    else {
      // on affiche 1 et ...
      if (page > 1) {
        tpages.push({
            'val': 0,
            'txt': '1',
            'class': 'no'
          })
        
        
        if (page > 2) {
          tpages.push({
              'val': (page - 2),
              'txt': '...',
              'class': 'out-of-range'
          
          })
          
        }
      }
      // pour l'affichage entre ...s
      if (page === 0) {
        pageCutHigh += 2;
      } else if (page === 1) {
        pageCutHigh += 1;
      }
      if (page === tot) {
        pageCutLow -= 2;
      } else if (page === tot - 1) {
        pageCutLow -= 1;
      }
      for (let p = pageCutLow; p <= pageCutHigh; p++) {
        if (p === -1) {
          p += 1;
        }
        if (p > tot) {
          continue
        }
        active = page == p ? "active" : "no";
        tpages.push({
            'val': p,
            'txt': '' + (p + 1),
            'class': active
          })
        
        
      }
      // on affiche ... et la derniere page
      if (page < tot - 1) {
        if (page < tot - 2) {
          tpages.push({
              'val': (page + 2),
              'txt': '...',
              'class': 'out-of-range'
            })
          
          
        }
        tpages.push({
            'val': tot,
            'txt': '' + tot,
            'class': 'no'
          })
        
        
      }
    }
    // affichage de next/disable
    if (page < tot) {
      tpages.push({
          'val': (page + 1),
          'txt': 'Next',
          'class': 'next no'
        })
      
      
    } else {
      tpages.push({
          'val': tot,
          'txt': 'Next',
          'class': 'next no disable'
        })
      
      
    }

    this.setState({
      pages : tpages
    })
  }
  render(){
    let listPage = this.state.pages.map(
      (el, index) => {
        return <li key={index} className= {"page-item " + el.class}><a onClick={() => this.props.getRequest(el.val)}>{ el.txt }</a></li>
      }
    );
    return(
      <ul>
      {listPage}
      </ul>
    )
  }
}

class App extends Component {
  constructor(props) {
    super(props);

    this.getRequest = this.getRequest.bind(this);
    this.getCount = this.getCount.bind(this);

    this.state = {
      visibleResto : [],
      currentPage : -1,
      itemsPerPage : 10,
      numPages : 0 
    };
  }

  componentWillMount(){
    this.getRequest(0);
  }

  getRequest(cp) {
    if (cp !== this.state.currentPage) {
      this.setState({
        currentPage: cp
      })

      let url = "http://localhost:8080/api/restaurants?page=" + cp + "&pagesize=" + this.state.itemsPerPage;
      fetch(url)
        .then((response) => {
          response.json()
            .then((res) => {
              // Maintenant res est un vrai objet JavaScript
              this.getCount();
              this.setState({
                visibleResto: res.data
              })
            });
        })
        .catch(function (err) {
          console.log(err);
        });
    }
  }

  getCount() {
    let url = "http://localhost:8080/api/restaurants/count";

    fetch(url)
        .then((responseJSON) => {
            responseJSON.json()
            .then((res) => {
                // Maintenant res est un vrai objet JavaScript
                this.setState({
                  numPages : parseInt(res.data)/this.state.itemsPerPage-1
                })
            });
        })
        .catch(function (err) {
            console.log(err);
    });
	}

  render() {
    let listComponents = this.state.visibleResto.map(
      (el, index) => {
        return <Resto key={index} 
        index={index} 
        resto={el}/>
      }
    );
    return (
    <div className="App">
      <h3>My hobbies:</h3>
      <table className="rwd-table">
        <thead>
        <tr>
          <th>Nom</th>
          <th>Cuisine</th>
        </tr>
        </thead>
        <tbody>
        {listComponents}
        </tbody>
      </table>
      <Pagi numPages={this.state.numPages} getRequest={this.getRequest} page={this.state.currentPage}/>
    </div>
    );
  }
}

export default App;