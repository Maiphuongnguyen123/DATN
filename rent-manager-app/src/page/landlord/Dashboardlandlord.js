import React, { useEffect, useState } from 'react';
import { Link, Navigate } from 'react-router-dom'
import Nav from './Nav';
import SidebarNav from './SidebarNav';
import '../../assets/css/app.css';
import BarChart from './chart/BarChart';
import PieChart from './chart/PieChart';
import { getByCost, getByMonth, getNumber } from '../../services/fetch/ApiUtils';
import { RevenueData } from '../../utils/Data';
import SubChart from './chart/SubChart';


function Dashboardlandlord(props) {
    console.log("Props:", props)
    const { authenticated, role, currentUser, location, onLogout } = props;

    const [number, setNumber] = useState({
        numberOfRoom: '',
        numberOfPeople: '',
        numberOfEmptyRoom: '',
        revenue: '',
        waterCost: '',
        publicElectricCost: '',
        internetCost: '',
    });

    const [contentRevenue, setContentRevenue] = useState([]);
    const [currentMonthData, setCurrentMonthData] = useState([]);

    const [revenueData, setRevenueData] = useState(); 

    const [subData, setSubData] = useState({
        labels: [],
        datasets: [
          {
            label: "Doanh thu",
            data: [],
            backgroundColor: [
              "rgba(75,192,192,1)",
              "#ecf0f1",
              "#50AF95",
              "#f3ba2f",
              "#2a71d0",
            ],
            borderColor: "black",
            borderWidth: 2,
          },
        ],
    });

    const [userData, setUserData] = useState({
        labels: [],
        datasets: [
          {
            label: "Doanh thu",
            data: [],
            backgroundColor: [
              "rgba(75,192,192,1)",
              "#ecf0f1",
              "#50AF95",
              "#f3ba2f",
              "#2a71d0",
            ],
            borderColor: "black",
            borderWidth: 2,
          },
        ],
      });


      const [costData, setCostData] = useState({
        labels: [],
        datasets: [
          {
            label: "Doanh thu",
            data: [],
            backgroundColor: [
              "rgba(75,192,192,1)",
              "#ecf0f1",
              "#50AF95",
              "#f3ba2f",
              "#2a71d0",
            ],
            borderColor: "black",
            borderWidth: 2,
          },
        ],
      });

    useEffect(() => {
        getNumber()
            .then(response => {
                const number = response;
                setNumber(prevState => ({
                    ...prevState,
                    ...number
                }));
            })
            .catch(error => {
                console.log(error)
            });


    }, []);

    const monthOfNow = new Date().getMonth() + 1;

    useEffect(() => {
        getByMonth()
          .then((revenueData) => {
            setUserData((prevUserData) => ({
              ...prevUserData,
              labels: revenueData.content.filter((data) => data.month === monthOfNow).map((data) => "Tháng " + data.month),
              datasets: [
                {
                  ...prevUserData.datasets[0],
                  data: revenueData.content.map((data) => data.revenue),
                },
              ],
            }));
            console.log("userData", userData);
            setContentRevenue(revenueData.content);
            setSubData((prevUserData) => ({
                ...prevUserData,
                labels: revenueData.content.filter((data) => data.month === monthOfNow).map((data) => "Tháng " + data.month),
                datasets: [
                  {
                    ...prevUserData.datasets[0],
                    label: "Tiền nước",
                    backgroundColor: "rgba(75,192,192,1)",
                    data: revenueData.content.map((data) => data.waterCost),
                  },
                  {
                    ...prevUserData.datasets[0],
                    label: "Tiền điện",
                    backgroundColor: "#ecf0f1",
                    data: revenueData.content.map((data) => data.publicElectricCost),
                  },
                  {
                    ...prevUserData.datasets[2],
                    label: "Tiền internet",
                    backgroundColor: "#50AF95",
                    data: revenueData.content.map((data) => data.internetCost),
                  }
                ],
              }));
          })
          .catch((error) => {
            console.log(error);
          });

        //   getByCost()
        //   .then((revenueData) => {
        //     setCostData((prevUserData) => ({
        //       ...prevUserData,
        //       labels: revenueData.content.map((data) => data.name),
        //       datasets: [
        //         {
        //           ...prevUserData.datasets[0],
        //           data: revenueData.content.map((data) => data.cost),
        //         },
        //       ],
        //     }));
        //   })
        //   .catch((error) => {
        //     console.log(error);
        //   });
      }, []);

      useEffect(() => {
        const date = new Date();
        const currentMonth = date.getMonth() + 1;
        const currentMonthData = contentRevenue.filter(content => content.month === currentMonth)
        console.log("currentMonthData", currentMonthData);
      })

console.log("subData", subData);
    if (!props.authenticated) {
        return <Navigate
            to={{
                pathname: "/login-landlord",
                state: { from: location }
            }} />;
    }

    return (
        <div className="wrapper">
            <nav id="sidebar" className="sidebar js-sidebar">
                <div className="sidebar-content js-simplebar">
                    <a className="sidebar-brand" href="index.html">
                        
                    </a>
                    <SidebarNav />
                </div>
            </nav>

            <div className="main">
                <Nav onLogout={onLogout} currentUser={currentUser} />

                <main style={{ margin: "20px 20px 20px 20px" }}>
                    <div className="container-fluid p-0">
                        <div class="row mb-2 mb-xl-3">
                            <div class="col-auto d-none d-sm-block">
                                <h3><strong>✨</strong> Thống kê</h3>
                            </div>
                        </div>
                        <div class="row">
                            <div class="col-sm-6 col-xl-3">
                                <div class="card">
                                    <div class="card-body">
                                        <div class="row">
                                            <div class="col mt-0">
                                                <h5 class="card-title">Tổng Phòng</h5>
                                            </div>

                                            <div class="col-auto">
                                                <div class="stat text-primary">
                                                <img 
                                                  src="../../assets/img/home-dark.png" 
                                                  alt="Home Icon" 
                                                  width="24" 
                                                 height="24" 
                                                  className="align-middle"
                                                />                                                </div>
                                            </div>
                                        </div>
                                        <h1 class="mt-1 mb-3">{number.numberOfRoom}</h1>
                                        <div class="mb-0">
                                            <span class="badge badge-success-light"> <i class="mdi mdi-arrow-bottom-right"></i> 3.65% </span>

                                        </div>
                                    </div>
                                </div>
                            </div>
                            <div class="col-sm-6 col-xl-3">
                                <div class="card">
                                    <div class="card-body">
                                        <div class="row">
                                            <div class="col mt-0">
                                                <h5 class="card-title">Số người thuê</h5>
                                            </div>

                                            <div class="col-auto">
                                                <div class="stat text-primary">
                                                <img 
                                                  src="../../assets/img/people.png" 
                                                  alt="Home Icon" 
                                                  width="24" 
                                                 height="24" 
                                                  className="align-middle"
                                                />
                                                </div>
                                            </div>
                                        </div>
                                        <h1 class="mt-1 mb-3">{number.numberOfPeople}</h1>
                                        <div class="mb-0">
                                            <span class="badge badge-danger-light"> <i class="mdi mdi-arrow-bottom-right"></i> -5.25% </span>

                                        </div>
                                    </div>
                                </div>
                            </div>
                            <div class="col-sm-6 col-xl-3">
                                <div class="card">
                                    <div class="card-body">
                                        <div class="row">
                                            <div class="col mt-0">
                                                <h5 class="card-title">Phòng trống</h5>
                                            </div>

                                            <div class="col-auto">
                                                <div class="stat text-primary">
                                                <img 
                                                  src="../../assets/img/home-while.png" 
                                                  alt="Home Icon" 
                                                  width="24" 
                                                 height="24" 
                                                  className="align-middle"
                                                />
                                                 </div>
                                            </div>
                                        </div>
                                        <h1 class="mt-1 mb-3">{number.numberOfEmptyRoom}</h1>
                                        <div class="mb-0">
                                            <span class="badge badge-success-light"> <i class="mdi mdi-arrow-bottom-right"></i> 4.65% </span>
                                        </div>
                                    </div>
                                </div>
                            </div>
                            <div class="col-sm-6 col-xl-3">
                                <div class="card">
                                    <div class="card-body">
                                        <div class="row">
                                            <div class="col mt-0">
                                                <h5 class="card-title">Doanh Thu</h5>
                                            </div>

                                            <div class="col-auto">
                                                <div class="stat text-primary">
                                                <img 
                                                  src="../../assets/img/dollar.png" 
                                                  alt="Home Icon" 
                                                  width="24" 
                                                 height="24" 
                                                  className="align-middle"
                                                />
                                                </div>
                                            </div>
                                        </div>
                                        <h1 class="mt-1 mb-4" style={{ fontSize: "xx-large" }}>{number.revenue.toLocaleString('vi-VN', {
                                            style: 'currency',
                                            currency: 'VND',
                                        })}
                                        </h1>
                                        <div class="mb-0">
                                            <span class="badge badge-success-light"> <i class="mdi mdi-arrow-bottom-right"></i> 2.35% </span>

                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                        <div class="row">
                            <div class="col-12 col-lg-6 d-flex">
                                <div class="card flex-fill w-100">
                                    <div class="card-header">
                                        <div class="float-end">

                                        </div>
                                        <h5 class="card-title mb-0">Doanh Thu Tiền Phòng</h5>
                                    </div>
                                    <div class="card-body pt-2 pb-3">
                                        <div class="chart chart-md"><div class="chartjs-size-monitor"><div class="chartjs-size-monitor-expand"><div class=""></div></div><div class="chartjs-size-monitor-shrink"><div class=""></div></div></div>
                                            <BarChart chartData={userData} />
                                        </div>
                                    </div>
                                </div>
                            </div>
                            <div class="col-12 col-lg-6 d-flex">
                                <div class="card flex-fill w-100">
                                    <div class="card-header">
                                        <div class="float-end">
                                        </div>
                                        <h5 class="card-title mb-0">Doanh Thu Từ Chi Phí Khác</h5>
                                    </div>
                                    <SubChart chartData={subData} />
                                </div>
                            </div>
                        </div>

                    </div>
                </main>
            </div>
        </div>
    )
}

export default Dashboardlandlord;