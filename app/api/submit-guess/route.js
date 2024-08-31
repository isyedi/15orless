// app/api/submit-guess/route.js

export async function POST(req) {
    const { guess, word } = await req.json();
    if (guess.toLowerCase() === word.toLowerCase()) {
      return new Response(JSON.stringify({ result: "correct" }), { status: 200 });
    } else {
      return new Response(JSON.stringify({ result: "incorrect" }), { status: 200 });
    }
  }
  