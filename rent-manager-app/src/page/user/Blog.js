import React from 'react';
import Header from '../../common/Header';
import Footer from '../../common/Footer';
import { Link } from 'react-router-dom';

const Blog = (props) => {
  const blogs = [
    {
      id: 1,
      title: "Tại sao nên sử dụng RentMate - nền tảng cho thuê nhà trọ số 1 Việt Nam",
      description: "Trong bối cảnh nhu cầu thuê nhà trọ tại Việt Nam ngày càng tăng, đặc biệt ở các thành phố lớn...",
      image: "/assets/img/phongtro1.jpg",
      date: "15/03/2024",
      author: "Admin"
    },
    {
      id: 2,
      title: "5 Bí quyết tìm phòng trọ phù hợp cho sinh viên",
      description: "Việc tìm được một phòng trọ phù hợp là mối quan tâm hàng đầu của sinh viên khi bắt đầu năm học mới...",
      image: "/assets/img/phongtro2.jpg",
      date: "14/03/2024",
      author: "Admin"
    },
    {
      id: 3,
      title: "Kinh nghiệm quản lý nhà trọ hiệu quả cho chủ trọ",
      description: "Quản lý nhà trọ không chỉ đơn giản là cho thuê và thu tiền, mà còn cần nhiều kỹ năng và kinh nghiệm...",
      image: "/assets/img/phongtro3.jpg",
      date: "13/03/2024",
      author: "Admin"
    }
  ];

  return (
    <>
      <Header
        authenticated={props.authenticated}
        currentUser={props.currentUser}
        onLogout={props.onLogout}
      />
      <main id="main">
        <section className="intro-single">
          <div className="container">
            <div className="row">
              <div className="col-md-12 col-lg-8">
                <div className="title-single-box">
                  <h1 className="title-single">Blog</h1>
                  <span className="color-text-a">
                    Các bài viết hữu ích về thuê trọ và quản lý nhà trọ
                  </span>
                </div>
              </div>
              <div className="col-md-12 col-lg-4">
                <nav aria-label="breadcrumb" className="breadcrumb-box d-flex justify-content-lg-end">
                  <ol className="breadcrumb">
                    <li className="breadcrumb-item">
                      <Link to="/">Trang chủ</Link>
                    </li>
                    <li className="breadcrumb-item active" aria-current="page">
                      Blog
                    </li>
                  </ol>
                </nav>
              </div>
            </div>
          </div>
        </section>

        <section className="blog-grid grid">
          <div className="container">
            <div className="row">
              {blogs.map(blog => (
                <div className="col-md-4" key={blog.id}>
                  <div className="card-box-b card-shadow news-box">
                    <div className="img-box-b">
                      <img src={blog.image} alt={blog.title} className="img-b img-fluid" style={{height: '300px', width: '100%', objectFit: 'cover'}} />
                    </div>
                    <div className="card-overlay">
                      <div className="card-header-b">
                        <div className="card-category-b">
                          <Link to={`/blog/${blog.id}`} className="category-b">
                            {blog.author}
                          </Link>
                        </div>
                        <div className="card-title-b">
                          <h2 className="title-2">
                            <Link to={`/blog/${blog.id}`}>
                              {blog.title}
                            </Link>
                          </h2>
                        </div>
                        <div className="card-date">
                          <span className="date-b">{blog.date}</span>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </section>
      </main>
      <Footer />
    </>
  );
};

export default Blog;