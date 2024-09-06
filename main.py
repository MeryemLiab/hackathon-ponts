from flask import Flask , render_template , request, redirect, url_for, session

from flask_sqlalchemy import SQLAlchemy

from src.utils.ask_question_to_pdf import ask_question_to_pdf



app = Flask(__name__)


app.config['SQLALCHEMY_DATABASE_URI'] = 'sqlite:///messages.db'
db = SQLAlchemy(app)

class Message(db.Model):
    id = db.Column(db.Integer, primary_key=True)
    question = db.Column(db.String(200), nullable=False)
    response = db.Column(db.String(200), nullable=False)

with app.app_context():
    db.create_all()

@app.route('/submit', methods=['POST'])
def submit():
    question = request.form['question']
    response = process_question(question)  # Remplace par ton traitement
    
    # Enregistrer dans la base de données
    msg = Message(question=question, response=response)
    db.session.add(msg)
    db.session.commit()
    
    return redirect('/')

@app.route('/')
def index():
    messages = Message.query.all()
    return render_template('index.html', messages=messages)

#@app.route("/")
#def hello_world(name=None):
    #return render_template("index.html", name=name)



@app.route("/prompt" , methods=['POST'])
def prompt_response():
    #return {"answer": request.form['prompt']}
    user_prompt = request.form['prompt']
    pdf_path = "/Users/merye/hackathon/hackathon-ponts/src/utils/filename.pdf"
    answer = ask_question_to_pdf(pdf_path, user_prompt)
    return {"answer": answer}



@app.route("/question" , methods=['GET'])
def ask_question():
    qst = "poses moi une question concernant le texte"
    pdf_path = "/Users/merye/hackathon/hackathon-ponts/src/utils/filename.pdf"
    answer = ask_question_to_pdf(pdf_path, qst)
    return {"answer": answer}


@app.route("/answer" , methods=['POST'])
def answered_question():    

    pdf_path = "/Users/merye/hackathon/hackathon-ponts/src/utils/filename.pdf"

    #answer = ask_question_to_pdf(pdf_path, request.form['prompt'])

    answ = " est-ce que ma réponse " + " " + request.form['prompt'] + " " + "à cette question" + " " + request.form['question'] + " " + "est juste ?"
    
    return {"answer": ask_question_to_pdf(pdf_path, answ)}


a = ""


@app.route("/qcm", methods=["GET"])
def qcm():
    qst = "Donne une question à choix multiples concernant le texte"
    pdf_path = "/Users/merye/hackathon/hackathon-ponts/src/utils/filename.pdf"

    if pdf_path:
        answer = ask_question_to_pdf( pdf_path , qst )
    else:
        return "No uploaded file available", 400
    global a
    a = str(answer)
    return {"answer": answer}


@app.route("/A", methods=["GET"])
def A():
    global a
    qst = "Selon le texte, la réponse A est-elle la bonne réponse pour la question " + a
    pdf_path = "/Users/merye/hackathon/hackathon-ponts/src/utils/filename.pdf"

    if pdf_path:
        answer = ask_question_to_pdf( pdf_path , qst )
    else:
        return "No uploaded file available", 400
    return {"answer": answer}


@app.route("/B", methods=["GET"])
def B():
    global a
    qst = "Selon le texte, la réponse B est-elle la bonne réponse pour la question " + a
    pdf_path = "/Users/merye/hackathon/hackathon-ponts/src/utils/filename.pdf"

    if pdf_path:
        answer = ask_question_to_pdf( pdf_path , qst )
    else:
        return "No uploaded file available", 400
    return {"answer": answer}


@app.route("/C", methods=["GET"])
def C():
    global a
    qst = "Selon le texte, la réponse C est-elle la bonne réponse pour la question " + a
    pdf_path = "/Users/merye/hackathon/hackathon-ponts/src/utils/filename.pdf"

    if pdf_path:
        answer = ask_question_to_pdf( pdf_path , qst )
    else:
        return "No uploaded file available", 400
    return {"answer": answer}


@app.route("/D", methods=["GET"])
def D():
    global a
    qst = "Selon le texte, la réponse D est-elle la bonne réponse pour la question " + a
    pdf_path = "/Users/merye/hackathon/hackathon-ponts/src/utils/filename.pdf"

    if pdf_path:
        answer = ask_question_to_pdf( pdf_path , qst )
    else:
        return "No uploaded file available", 400
    return {"answer": answer}



