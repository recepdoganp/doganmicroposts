import {http} from './http';
import {ui} from './ui';

// get posts on DOM load
document.addEventListener('DOMContentLoaded',getPosts);

// listen for add posts
document.querySelector('.post-submit').addEventListener('click',submitPost)

// listen for delete event
document.querySelector('#posts').addEventListener('click',deletePost);

// listen for edit state
document.querySelector('#posts').addEventListener('click',enableEdit);

// listen for cancel 
document.querySelector('.card-form').addEventListener('click',cancelEdit);


// get posts
function getPosts(){
  http.get('http://localhost:3000/posts')
  .then(data=>ui.showPosts(data))
  .catch(err=>console.log(err.message))
}

// submit posts
function submitPost(){
  const title = document.querySelector('#title').value;
  const body = document.querySelector('#body').value;
  const id = document.querySelector('#id').value;

  // if key and the value are the same
  const data = {
    title,
    body
  };
  //validate input
  if(title === '' || body === ''){
    ui.showAlert('Please fill in all fields', 'alert alert-danger')
  }else{
    //check for ID
    if(id === ''){
      // create post
      http.post('http://localhost:3000/posts',data)
      .then(data=>{
        ui.showAlert('Post added!','alert alert-success');
        ui.clearFields();
        getPosts()
      })
      .catch(e=>console.log(e.message))
    }  else{
      // update post
      console.log('updating')
      http.put(`http://localhost:3000/posts/${id}`,data)
      .then(data=>{
        ui.showAlert('Post updated!','alert alert-success');
        ui.changeFormState('add');
        getPosts()
      })
      .catch(e=>console.log(e.message))
    }
  }
}

//delete post
function deletePost(e){
  if(e.target.parentElement.classList.contains('delete')){
    const id = e.target.parentElement.dataset.id;
    console.log(id);
    if(confirm('Are you sure?')){
      http.delete(`http://localhost:3000/posts/${id}`)
      .then(data=>{
        ui.showAlert('Post deleted!','alert alert-success');
        getPosts();
      })
      .catch(err=>console.log(err.message))
    }
  }
  e.preventDefault();
}

// enable edit state
function enableEdit(e){
  console.log(e.target.parentElement.classList)
  if(e.target.parentElement.classList.contains('edit')){
    const id = e.target.parentElement.dataset.id;
    http.get(`http://localhost:3000/posts/${id}`)
    .then(data=>{
      const updatePost={
        id: data.id,
        title: data.title,
        body: data.body
      };

      //fill the form with current post
      ui.fillForm(updatePost)

    })
    .catch(err=>console.log(err.message))
  }
  e.preventDefault()
}

// cancel edit state
function cancelEdit(e){
  if(e.target.classList.contains('post-cancel')){
    ui.changeFormState('add');
  }

  e.preventDefault()
}