import React, { useState } from "react";
import { motion } from "framer-motion";
import "../Styles/Comments.css";

interface Comment {
  id: number;
  username: string;
  avatar: string;
  text: string;
  timestamp: string;
}

interface CommentsProps {
  initialUsername: string; // Имя из Upload.tsx через Results.tsx
}

const initialComments: Comment[] = [
  {
    id: 1,
    username: "Алексей Иванов",
    avatar:
      "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcRrsiqZwzE-NEYjQr5AY2Fv3L3Z2a30WFp_OQ&s",
    text: "Анализ просто огонь! Как будто в будущем живём.",
    timestamp: "2025-05-09 18:30",
  },
  {
    id: 2,
    username: "Шахзод Абдуллаев",
    avatar:
      "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcRJ7EAItwkCi5Ljpbe-HdmUEC8Nkp6Dt3EGiw&s",
    text: "Дизайн сайта шикарный, всё быстро и чётко!",
    timestamp: "2025-05-09 19:15",
  },
  {
    id: 3,
    username: "Екатерина Смирнова",
    avatar: "https://stuki-druki.com/biofoto4/smirnova-zaporozhskiy.jpg",
    text: "Сравнение слайдером — это что-то! Очень круто.",
    timestamp: "2025-05-09 20:00",
  },
  {
    id: 4,
    username: "Дилшод Рахимов",
    avatar:
      "https://storage.kun.uz/source/3/6bPOSDVAp9OfMW5ZB2NSG8iYegz97iEv.jpg",
    text: "Можно добавить тёмную тему? Было бы идеально.",
    timestamp: "2025-05-09 20:45",
  },
  {
    id: 5,
    username: "Мария Петрова",
    avatar:
      "https://sochi.ru/upload/iblock/0e8/0e8e97768e3944500592961bb4afcab4/485a91da0dafd3e38a3ba200ed46e00c.jpg",
    text: "Анимации такие плавные, как в фантастическом фильме!",
    timestamp: "2025-05-09 21:10",
  },
  {
    id: 6,
    username: "Бахтиёр Хамидов",
    avatar:
      "https://uzreport.news/fotobank/image/2ef6537426e372f74270c370062d23a5.jpeg",
    text: "Лучший инструмент для анализа рентгена, браво!",
    timestamp: "2025-05-09 21:30",
  },
];

const Comments: React.FC<CommentsProps> = ({ initialUsername }) => {
  const [comments, setComments] = useState<Comment[]>(initialComments);
  const [newComment, setNewComment] = useState({ text: "" });

  const handleInputChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    setNewComment({ text: e.target.value });
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (newComment.text.trim() && initialUsername.trim()) {
      const newId = comments.length + 1;
      const timestamp = new Date().toLocaleString("ru-RU", {
        year: "numeric",
        month: "numeric",
        day: "numeric",
        hour: "2-digit",
        minute: "2-digit",
      });
      const newCommentData: Comment = {
        id: newId,
        username: initialUsername,
        avatar:
          "https://upload.wikimedia.org/wikipedia/commons/thumb/5/59/User-avatar.svg/2048px-User-avatar.svg.png",
        text: newComment.text,
        timestamp,
      };
      setComments([newCommentData, ...comments]);
      setNewComment({ text: "" });
    }
  };

  return (
    <div className="comments-container">
      <h2 className="comments-title">Отзывы сообщества</h2>
      <form className="comment-form" onSubmit={handleSubmit}>
        <input
          type="text"
          value={initialUsername}
          className="comment-input"
          disabled
        />
        <textarea
          name="text"
          value={newComment.text}
          onChange={handleInputChange}
          placeholder="Напишите ваш отзыв..."
          className="comment-textarea"
          required
        />
        <motion.button
          type="submit"
          className="comment-submit"
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
          disabled={!initialUsername.trim()}
        >
          Отправить
        </motion.button>
      </form>
      <div className="comments-list">
        {comments.map((comment) => (
          <motion.div
            key={comment.id}
            className="comment-card"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: comment.id * 0.1 }}
          >
            <div className="comment-header">
              <img
                src={comment.avatar}
                alt={`${comment.username} avatar`}
                className="comment-avatar"
              />
              <div className="comment-user-info">
                <span className="comment-username">{comment.username}</span>
                <span className="comment-timestamp">{comment.timestamp}</span>
              </div>
            </div>
            <p className="comment-text">{comment.text}</p>
          </motion.div>
        ))}
      </div>
    </div>
  );
};

export default Comments;
