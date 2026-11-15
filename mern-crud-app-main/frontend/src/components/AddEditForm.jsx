import { useState, useEffect } from "react";
import { useNavigate, useParams } from "react-router-dom";

function AddEditForm() {
  const { id } = useParams();
  const navigate = useNavigate();

  const [title, setTitle] = useState("");
  const [content, setContent] = useState("");

  useEffect(() => {
    if (id) {
      async function fetchPost() {
        const response = await fetch(
          `https://mern-crud-backend-6moo.onrender.com/api/v1/posts/${id}`
        );
        const data = await response.json();
        setTitle(data.data.title);
        setContent(data.data.content);
      }

      fetchPost();
    }
  }, [id]);

  const handleSubmit = async (e) => {
    e.preventDefault();

    const method = id ? "PUT" : "POST";

    const url = id
      ? `https://mern-crud-backend-6moo.onrender.com/api/v1/posts/${id}`
      : "https://mern-crud-backend-6moo.onrender.com/api/v1/posts";

    await fetch(url, {
      method,
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ title, content }),
    });

    navigate("/");
  };

  return (
    <div className="form-page">
      <div className="form-title">
        {id ? "Edit Post" : "Create a New Post"}
      </div>

      <form className="post-form" onSubmit={handleSubmit}>
        <label htmlFor="title">Post Title</label>

        <input
          id="title"
          type="text"
          placeholder="Enter post title"
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          required
        />

        <label htmlFor="content">Post Content</label>

        <textarea
          id="content"
          placeholder="Write your post content..."
          value={content}
          onChange={(e) => setContent(e.target.value)}
          required
        />

        <button type="submit">
          {id ? "Update Post" : "Create Post"}
        </button>
      </form>
    </div>
  );
}

export default AddEditForm;
