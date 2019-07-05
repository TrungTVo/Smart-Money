import React, { Component } from 'react';
import NavBar from './NavBar';
import Footer from './Footer';

export class About extends Component {
  render() {
    return (
      <div>
        <NavBar active='about' />

        <div className="card mt-5 ml-5 mr-5 border-0 about-card">
          <div className="row no-gutters">
            <div className="col-md-7 ml-auto mt-auto mb-auto" >
              <img src="/img/transactions.png" className="card-img" alt="daily-transactions" />
            </div>
            <div className="col-md-4 ml-auto mr-auto mt-auto mb-auto">
              <div className="card-body text-center">
                <h2 className="card-title">Daily transactions</h2>
                <p className="card-text text-muted">
                  Keep track of your daily expenses based on your specific categories, you can also take notes
                  and sort as well as filter your desired transactions to fit your needs.
                </p>
              </div>
            </div>
          </div>
        </div>

        <div className="card ml-5 mr-5 border-0 about-card" >
          <div className="row no-gutters">
            <div className="col-md-7 ml-auto mt-auto mb-auto" >
              <img src="/img/bars-chart.png" className="card-img" alt="bars-chart" />
            </div>
            <div className="col-md-4 ml-auto mr-auto">
              <div className="card-body text-center">
                <h1 className="card-title">Bars chart</h1>
                <p className="card-text text-muted">
                  Leverage the power of data visualization to control your daily payments, you can now be able to track
                  your daily expenses based on specific categories and visualize them on bars chart.
                </p>
              </div>
            </div>
          </div>
        </div>

        <div className="card ml-5 mr-5 border-0 about-card" >
          <div className="row no-gutters">
            <div className="col-md-7 ml-auto mt-auto mb-auto" >
              <img src="/img/pie-chart.png" className="card-img" alt="pie-chart" />
            </div>
            <div className="col-md-4 ml-auto mr-auto">
              <div className="card-body text-center">
                <h1 className="card-title">Pie chart</h1>
                <p className="card-text text-muted">
                  You not only be able to visualize exactly how much your transactions with eaach category are, but also be able
                  to see which ones you exceed too much based on their percentage uses, from that control your money more efficiently and stay
                  out of debt.
                </p>
              </div>
            </div>
          </div>
        </div>

        <div className="card ml-5 mr-5 mb-5 border-0 about-card" >
          <div className="row no-gutters">
            <div className="col-md-7 ml-auto mt-auto mb-auto" >
              <img src="/img/line-chart.png" className="card-img" alt="bars-chart" />
            </div>
            <div className="col-md-4 ml-auto mr-auto">
              <div className="card-body text-center">
                <h1 className="card-title">Line chart</h1>
                <p className="card-text text-muted">
                  Compare your daily expenses based on different categories within certain timeframe to better keep track of your
                  daily expenses.
                </p>
              </div>
            </div>
          </div>
        </div>

        <Footer />
      </div>
    )
  }
}

export default About;
