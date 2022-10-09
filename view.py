from flask import Blueprint, render_template, redirect, url_for, request, Response

view = Blueprint(__name__, "vỉew")

@view.route("/")
def home():
    return render_template("index.html", name="Keano")

@view.route("/login", methods=['GET', 'POST'])
def login():
    error = None
    if request.method=='POST':
        if request.form['username'] != 'admin' or request.form['password'] != 'admin':
            error = 'Invalid username/password. Please re-enter.'
        else:
            return redirect(url_for('home'))
    return render_template('login.html', error=error)

@view.route("/wav")
def streamwav():
    def generate():
        with open("signals/song.wav", "rb") as fwav:
            data = fwav.read(1024)
            while data:
                yield data
                data = fwav.read(1024)
    return Response(generate(), mimetype="audio/x-wav")


@view.route("/ogg")
def streamogg():
    def generate():
        with open("signals/song.ogg", "rb") as fogg:
            data = fogg.read(1024)
            while data:
                yield data
                data = fogg.read(1024)
    return Response(generate(), mimetype="audio/ogg")

if __name__ == "__main__":
    view.run(debug=True)