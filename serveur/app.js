import express from 'express'
import { bd } from './data/films.js';

const app = express();

app.use(express.json());

const router = express.Router();


//GET
router.get("/", (req,res)=>{
    try{
        return res.redirect("/api/films");
    }
    catch(err){
        return res.status(500).json({message:'Erreur du serveur'});
    }
})

router.get("/api/films", (req, res) => {
    try {
        const { annee } = req.query;
        if (annee) {
            if (isNaN(annee)) {
                return res.status(400).json({ message: 'Annee doit etre un entier' });
            }
            const f = bd.filter(a => a.annee == annee);
            return res.status(200).json(f);
        }
        return res.status(200).json(bd);

    } catch (err) {
        return res.status(500).json({ message: 'Erreur du serveur' })
    }
});

router.get("/api/films/:id", (req, res) => {
    const id = req.params.id;
    try {
        if (isNaN(id)) return res.status(404).json({ message: 'Id doit etre un entier' });
        const film = bd.find(f => f.id == id);
        if (!film) return res.status(404).json({ message: 'Id inconnu' });
        
        return res.status(200).json(film);
    } catch (err) {
        return res.status(500).json({ message: 'Erreur du serveur' })
    }
});

        router.post("/api/films", (req,res)=>{
            const {titre, annee, realisateur} = req.body;
            try{
                if(!titre || !(titre.trim()) || !annee || isNaN(annee)) return res.status(400).json({message:'Mauvaise requete'});
            
                const max_id = Math.max(...bd.map(a=>a.id));
                const new_film = {
                    id:max_id+1,
                    titre,
                    annee,
                    realisateur
                };
                bd.push(new_film);
                return res.status(201).json(new_film);
            }catch(err){
                return res.status(500).json({message:"Erreur du serveur"});
            }
        });

        router.delete("/api/films/:id", (req,res)=>{
            try{
                const id = req.params.id;
                if(!id) return res.status(400).json({message:"Id attendu"});
                if(isNaN(id)) return res.status(404).json({message:"Id doit etre un entier"});
                
                const index = bd.findIndex( f=>f.id==id);
                if(index==-1) return res.status(400).json({message:"Id inconnu"});
                bd.splice(index,1);
                return res.status(204);
            }catch(err){
                return res.status(500).json({message:"Erreur du serveur"})
            }
        })

        app.use(router);

        app.listen(3000, () => console.log('sereur démarré'));


