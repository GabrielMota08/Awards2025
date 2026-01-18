import { Body, Controller, Get, Post, Param, Req, UseGuards, Delete } from '@nestjs/common';
import { VoteService } from './vote.service';
import { AuthGuard } from '@nestjs/passport';
import { VoteDto } from './dto/vote.dto';

@Controller('vote')
@UseGuards(AuthGuard('jwt'))
export class VoteController {
    constructor(private readonly voteService: VoteService) {}

    @Get(':token')
    getVoteData(@Param('token') token: string){
        return this.voteService.getVoteData(token)
    }

    @Post()
    createVote(@Body() voteDto: VoteDto, @Req() req){
        return this.voteService.createVote(voteDto, req.user.userId)
    }

    @Delete()
    deleteVote(@Body() voteDto: VoteDto, @Req() req){
        return this.voteService.deleteVote(voteDto, req.user.userId)
    }

    @Get(':groupId')
    getMyVotes(@Param('groupId') groupId: number, @Req() req){
        return this.voteService.getMyVotes(groupId, req.user.userId)
    }

    @Get('/results/:groupId')
    getResults(@Param('groupId') groupId: number){
        return this.voteService.getResults(groupId)
    }

    @Get('/winners/:token')
    getWinners(@Param('token') token: string){
        return this.voteService.getWinners(token)
    }

app.get("/api/results/:groupId", authenticateToken, (req, res) => {
    const groupId = req.params.groupId;
    const sql = `
        SELECT c.name as category, n.name as nominee, COUNT(v.id) as votes
        FROM categories c
        JOIN nominees n ON n.category_id = c.id
        LEFT JOIN votes v ON v.nominee_id = n.id
        WHERE c.group_id = ?
        GROUP BY n.id
        ORDER BY c.id, votes DESC
    `;
    db.query(sql, [groupId], (err, result) => {
        if (err) return res.status(500).send(err);
        res.send(result);
    });
});

app.listen(PORT, () => {
    console.log("Servidor rodando na porta " + PORT);
});

app.get("/api/winners/:token", (req, res) => {
    const { token } = req.params;

    // 1. Validar Grupo e Data
    db.query("SELECT * FROM award_groups WHERE access_token = ?", [token], (err, groups) => {
        if (err || groups.length === 0) return res.status(404).send({ msg: "Votação não encontrada" });

        const group = groups[0];
        const now = new Date();
        const endDate = new Date(group.end_date);

        // Se a votação ainda não acabou, bloqueia
        if (now <= endDate) {
            return res.status(403).send({ msg: "A votação ainda está em andamento." });
        }

        // 2. Query para descobrir quem ganhou em cada categoria
        // Retorna: category_id e o nominee_id do vencedor (quem tem mais votos)
        const sql = `
            SELECT 
                c.id as category_id,
                n.id as winner_id,
                COUNT(v.id) as vote_count
            FROM categories c
            JOIN nominees n ON c.id = n.category_id
            LEFT JOIN votes v ON n.id = v.nominee_id
            WHERE c.group_id = ?
            GROUP BY c.id, n.id
            ORDER BY c.id, vote_count DESC
        `;

        db.query(sql, [group.id], (err, rows) => {
            if (err) return res.status(500).send(err);

            // 3. Processamento: Cria um mapa { categoryId: winnerNomineeId }
            const winnersMap = {};
            const seenCategories = new Set();

            rows.forEach(row => {
                // Como ordenamos por votos DESC, o primeiro registro de cada categoria é o vencedor
                if (!seenCategories.has(row.category_id)) {
                    winnersMap[row.category_id] = row.winner_id;
                    seenCategories.add(row.category_id);
                }
            });

            // Retorna apenas o mapa de IDs
            res.send(winnersMap);
        });
    });
});
}
