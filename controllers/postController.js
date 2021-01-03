const mongoose = require('mongoose');
const Post = mongoose.model('Post');

exports.view = async (req, res) => {
    
    const post =  await Post.findOne({slug: req.params.slug});

    res.render('view', { post });
};

exports.add = (req, res) => {
    res.render('postAdd');
};

exports.addAction = async (req, res) => {
    req.body.tags = req.body.tags.split(',').map(t=>t.trim());
   const post = new Post (req.body);

   try {
        await post.save();
   } catch(error){
       req.flash('error', 'Error: '+error.message);
       return res.redirect('/post/add');
       
   }

   

   req.flash('success','Post salvo com sucesso');
   res.redirect('/');
};

exports.edit = async(req, res) => {
    // pegar as informacoes do post em questao

    const post =  await Post.findOne({slug: req.params.slug});

    //carregar o formulario de edicao

    res.render('postEdit', { post });
}

exports.editAction = async (req, res) => {
    req.body.slug = require('slug')(req.body.title, {lower: true});
    req.body.tags = req.body.tags.split(',').map(t=>t.trim());

    try{
    // procurar o item enviado
    //pegar os dados e atualizar
        const post= await Post.findOneAndUpdate({ slug: req.params.slug},
             req.body,
             {
                 new: true, // retorna novo item atualizado
                 runValidators: true
              }
             );
            }catch(error){
                req.flash('error', 'Ocorreu um erro ! Tente novamente mais tarde');
                return res.redirect('/post/'+req.params.slug+'/edit');
            };
    

    // mostrar mensagem de sucesso
    req.flash('success', 'Post atualizado com sucesso');

    // redirecionar para a home
    res.redirect('/');

}