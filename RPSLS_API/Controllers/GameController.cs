using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using Microsoft.AspNetCore.Mvc;

namespace RPSLS_API.Controllers
{
    [ApiController]
    [Route("[controller]")]
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
}