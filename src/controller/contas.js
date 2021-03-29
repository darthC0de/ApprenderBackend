const connection = require('../database/connection')

module.exports = {
    async index(req,res){
        await connection('contas')
            .select('*')
            .then(response=>{
                return res.status(200).json(response);
            })
            .catch(err=>{
                return res.status(400).json(err);
            })
    },
    async create(req,res){
        const { question, answer, type, options } = req.body;
        
        await connection('contas')
            .insert({ question, answer, type, options })
            .then(response=>{
                return res.status(200).json(response);
            })
            .catch(err=>{
                return res.status(400).json(err);
            })
    }
}