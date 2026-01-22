namespace RPSLS_API.Controllers;

[ApiController]
[Route("[Game]")]
public class GameController : ControllerBase
{
    [HttpGet("GetCpuChoice")]
    public string GetCpuChoice()
    {
        string[] choices = { "Rock", "Paper", "Scissors", "Lizard", "Spock" };
        Random rand = new Random();
        int index = rand.Next(choices.Length);
        return choices[index];
    }
}