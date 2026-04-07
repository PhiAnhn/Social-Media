import React, { useEffect, useState } from "react";
import { useParams, Link } from "react-router-dom";
// import axios from "axios";
import api from "../../api";
import PostCard from "../../components/News/PostCard";
import { BadgeCheck } from "lucide-react";
import "./ProfilePage.css";

const ProfilePage = () => {
  const { profileId } = useParams();
  const [user, setUser] = useState(null);
  const [posts, setPosts] = useState([]);
  const [activeTab, setActiveTab] = useState("posts");
  const [showEdit, setShowEdit] = useState(false);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      if (!profileId || isNaN(profileId)) return;

      try {
        setLoading(true);
        const [userRes, postsRes] = await Promise.all([
          api.get(`/users/${profileId}`),
          api.get(`/posts/user/${profileId}`),
        ]);
        setUser(userRes.data);
        setPosts(postsRes.data);
      } catch (err) {
        console.error("Lỗi lấy dữ liệu profile:", err);
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, [profileId]);

  if (loading) return <div className="profile-loading">Đang tải...</div>;
  if (!user) return <div className="profile-not-found">Không tìm thấy người dùng</div>;

  return (
    <div className="profile-page">
      {/* Header */}
      <header className="profile-header">
        {/* Avatar */}
        <img
          src={user.profile_picture || "/default-avatar.png"}
          alt={user.name}
          className="profile-avatar"
        />

        {/* Edit button */}
        <button className="edit-profile-btn" onClick={() => setShowEdit(true)}>
          Edit
        </button>

        {/* Info */}
        <div className="profile-info">
          <h1 className="profile-name">
            {user.name}
            <BadgeCheck className="badge-check" />
          </h1>
          <p className="profile-username">@{user.username}</p>

          <p className="profile-bio">
            Dreamer | Learner | Doer Exploring life one step at a time. Staying curious. Creating with purpose.
          </p>

          <p className="profile-joined">Joined 16 days ago</p>

          <div className="profile-stats">
            <span>
              <strong>{posts.length}</strong> Posts
            </span>
            {/* <span>
              <strong>2</strong> Followers
            </span>
            <span>
              <strong>2</strong> Following
            </span> */}
          </div>
        </div>
      </header>

      {/* Tabs */}
      <nav className="profile-tabs">
        {["posts", "pics", "likes"].map((tab) => (
          <button
            key={tab}
            className={`tab-btn ${activeTab === tab ? "active" : ""}`}
            onClick={() => setActiveTab(tab)}
          >
            {tab.charAt(0).toUpperCase() + tab.slice(1)}
          </button>
        ))}
      </nav>

      {/* Tab content */}
      <section className="tab-content">
        {activeTab === "posts" && (
          <div className="posts-grid">
            {posts.length > 0 ? (
              posts.map((post) => <PostCard key={post.id} post={post} />)
            ) : (
              <p className="no-posts">Chưa có bài viết nào.</p>
            )}
          </div>
        )}

        {activeTab === "pics" && (
          <div className="media-grid">
            {posts
              .filter((p) => p.image_urls && p.image_urls.length > 0)
              .flatMap((p) =>
                p.image_urls.map((img, i) => (
                  <div key={`${p.id}-${i}`} className="media-item">
                    <img src={img} alt="media" />
                    <p className="media-caption">
                      Đăng {new Date(p.created_at).toLocaleDateString()}
                    </p>
                  </div>
                ))
              )
              .slice(0, 6)}
          </div>
        )}

        {activeTab === "likes" && (
          <div className="likes-section">
            <p>Chưa có lượt thích nào được hiển thị.</p>
          </div>
        )}
      </section>

      {/* Edit modal */}
      {showEdit && (
        <div className="edit-modal-overlay" onClick={() => setShowEdit(false)}>
          <div className="edit-modal" onClick={(e) => e.stopPropagation()}>
            <h3>Chỉnh sửa hồ sơ</h3>
            <button onClick={() => setShowEdit(false)}>Đóng</button>
          </div>
        </div>
      )}
    </div>
  );
};

export default ProfilePage;