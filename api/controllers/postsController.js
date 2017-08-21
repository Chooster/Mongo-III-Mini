const mongoose = require('mongoose');

const Post = mongoose.model('Post');
const Comment = mongoose.model('Comment');

const STATUS_USER_ERROR = 422;
const STATUS_OK = 200;

/* Fill in each of the below controller methods */
const createPost = (req, res) => {
  const newPost = new Post({
    title: req.body.title,
    text: req.body.text,
  });
  newPost.save()
    .then((post) => {
      res.status(STATUS_OK);
      res.json(post);
    })
    .catch((err) => {
      handleError(err);
    });
};

const listPosts = (req, res) => {
  Post.find({}, (err, posts) => {
    if (err) {
      res.status(STATUS_USER_ERROR);
      res.json(err);
      return;
    } else if (!posts) {
      res.status(STATUS_USER_ERROR);
      res.json({ error: 'No list found.' });
      return;
    }
    res.status(STATUS_OK);
    res.json(posts);
  });
};

const findPost = (req, res) => {
  const { id } = req.params;
  Post.findById(id, (err, post) => {
    if (err) {
      res.status(STATUS_USER_ERROR);
      res.json(err);
      return;
    } else if (!post) {
        res.status(STATUS_USER_ERROR);
        res.json({ error: 'Couldn\'t find the specified user.' });
        return;
    }
    res.status(STATUS_OK);
    res.json(post);
  });
};

const addComment = (req, res) => {
  const { id } = req.params;
  Post.findById(id, (err, post) => {
    if (err) {
      res.status(STATUS_USER_ERROR);
      res.json(err);
      return;
    } else if (!post) {
      res.status(STATUS_USER_ERROR);
      res.json({ error: 'Could not find specified post.' });
      return;
    }
    const newComment = new Comment({
      _parent: post.id,
      text: req.body.text
    });
    post.comments.push(newComment);
    post.save();
    res.json(post);
  });
};

const deleteComment = (req, res) => {
  const { id, commentId } = req.params;
  Post.findById(id, (err, post) => {
    if (err) {
      res.status(STATUS_USER_ERROR);
      res.json(err);
      return;
    } else if (!post) {
      res.status(STATUS_USER_ERROR);
      res.json({ error: 'Could not find specified post.' });
      return;
    }
    post.findByIdAndRemove(commentId, (err, comment) => {
      if (err) {
        res.status(STATUS_USER_ERROR);
        res.json(err);
        return;
      } else if (!comment) {
        res.status(STATUS_USER_ERROR);
        res.json({ error: 'Could not find specified comment.' });
        return;
      }
      res.status(STATUS_OK);
      res.json(comment);
    });
  });
};

const deletePost = (req, res) => {
  const { id } = req.params;
  Post.findByIdAndRemove({ id }, (err, post) => {
    if (err) {
      res.status(STATUS_USER_ERROR);
      res.json(err);
      return;
    } else if (!post) {
      res.status(STATUS_USER_ERROR);
      res.json({ error: 'Could not find specified post.' });
      return;
    }
    res.status(STATUS_OK);
    res.json(post);
  });
};

module.exports = {
    createPost,
    listPosts,
    findPost,
    addComment,
    deleteComment,
    deletePost
};
