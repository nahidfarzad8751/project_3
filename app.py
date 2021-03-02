from flask import Flask, render_template
from flask import request, url_for, render_template, redirect
import pandas as pd
import numpy as np
import pdb, os
#import joblib
import keras
from sklearn.model_selection import train_test_split
from sklearn.preprocessing import OneHotEncoder
from sklearn.compose import ColumnTransformer 
from sklearn.preprocessing import LabelEncoder

from platform import python_version
print(python_version())

# Create an instance of our Flask app.
app = Flask(__name__)

# Set route
#https://sarahleejane.github.io/learning/python/2015/08/09/simple-tables-in-webapps-using-flask-and-pandas-with-python.html
@app.route('/')
def index():
    print('STARTING! '*20)
    mapbox_access_token = "pk.eyJ1IjoiZGF2aWRjb3kiLCJhIjoiY2tqcHU1YzBzOHY4ZjJxcWpkNGI5b2h2MSJ9.CsPttIW0Q41kP2uOBN6n8g"
    # pdb.set_trace()
    print(os.getcwd())
    # df = pd.read_csv('./static/data/data.csv')
    df = pd.read_csv('./static/data/data.csv')
    #df = df.head(5)
    return render_template('index.html', tables = [df.to_html(classes='female')],
        titles=['IDKLOL'],
        mapbox_access_token=mapbox_access_token)
@app.route('/neighborhood')
def neighborhood():
    return render_template('neighborhood.html')
@app.route('/typesofcrimes')
def crime():
    return render_template('crime.html')
@app.route('/timeofyear')
def year():
    return render_template('Timeofyear.html')




@app.route('/Results/<var>')
def Results(var):
    print('successs')
    pdb.set_trace()
    #return render_template('Results.html')
    return 'welcome %s' % var

@app.route('/prediction', methods = ['POST', 'GET'])
def Prediction():
    if request.method == 'POST':
        #This list has to be put together in the same format as saved in the Keras model
        X_unscaled = np.array([float(request.form['beat']),
                      float(request.form['occur_time']),
                      float(request.form['neighborhood']),
                      float(request.form['location_type']),
                      float(request.form['latitude']),
                      float(request.form['longitude']),
                      float(request.form['year']),
                      float(request.form['month']),
                      float(request.form['day']),
                      float(request.form['dayofweek']) ] )

        X_unscaled = X_unscaled.reshape(1,10)# Unfortunately needs to be reshaped from (,10) to (1,10)
        reconstructed_model = keras.models.load_model("models/DL/deep_learning_100_100_10.h5", compile=True)
        encoded_predictions = reconstructed_model.predict_classes(X_unscaled)
        #pdb.set_trace()
        label_encoder = LabelEncoder()
        label_encoder.classes_ = np.load('models/DL/dl_classes.npy',allow_pickle=True)
        prediction_labels = label_encoder.inverse_transform(encoded_predictions)
        prediction_labels
        #pdb.set_trace()
        #return render_template()
        #return redirect(url_for('Results', name = prediction_labels))
        return redirect(url_for('Results', var = prediction_labels))
    else:
      #user = request.args.get('nm')
      #return redirect(url_for('success',name = user))
      return render_template('prediction.html')


if __name__ == "__main__":
    app.run(debug=True)
