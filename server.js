const express = require('express');
const mongoose = require('mongoose');
const bodyParser = require('body-parser');
const cors = require('cors');

// MongoDBの接続設定
mongoose.connect('mongodb://localhost:27017/keijiban', {
    useNewUrlParser: true,
    useUnifiedTopology: true,
});

const app = express();
app.use(bodyParser.json());
app.use(cors());

// モデルの定義
const PostSchema = new mongoose.Schema({
    username: String,
    content: String,
    timestamp: Date,
    replies: [
        {
            username: String,
            content: String,
            timestamp: Date,
        },
    ],
});

const Post = mongoose.model('Post', PostSchema);

// 投稿の取得
app.get('/posts', async (req, res) => {
    const posts = await Post.find().sort({ timestamp: -1 });
    res.json(posts);
});

// 新しい投稿
app.post('/posts', async (req, res) => {
    const { username, content } = req.body;
    const post = new Post({
        username,
        content,
        timestamp: new Date(),
        replies: [],
    });
    await post.save();
    res.json(post);
});

// 返信の追加
app.post('/posts/:id/replies', async (req, res) => {
    const { id } = req.params;
    const { username, content } = req.body;
    const post = await Post.findById(id);
    post.replies.push({
        username,
        content,
        timestamp: new Date(),
    });
    await post.save();
    res.json(post);
});

// サーバーの起動
app.listen(3000, () => {
    console.log('Server is running on port 3000');
});
