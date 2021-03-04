from flask import Flask, render_template
from flask import request, url_for, render_template, redirect
import pandas as pd
import numpy as np
import pdb, os
from os import environ
import joblib
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
@app.route('/contactinfo')
def contact():
    return render_template('contactinfo.html')
@app.route('/index')
def homepage():
    return render_template('index.html')



@app.route('/Results/<var>', methods=['GET'])
def Results(var):
    print('successs' * 5    )
    #pdb.set_trace()#
    return render_template('html.html')
    #return 'welcome %s' % var

@app.route('/prediction', methods = ['POST', 'GET'])
def Prediction():
    if request.method == 'POST':#Used to send HTML form data to the server
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

        pdb.set_trace()
        reconstructed_model = keras.models.load_model('ml_models/DL/model_200_200_200_10/')
        # load the scaler
        scaler = joblib.load('ml_models/DL/scaler_200_200_200_10.sav')
        # load the encoding for y (UCR Literal)
        label_encoder = LabelEncoder()
        label_encoder.classes_ = np.load('ml_models/DL/classes.sav',allow_pickle=True)

        #Transform the x data to a scaled version that is appropriate for the model
        X_unscaled = X_unscaled.reshape(1,10)# Unfortunately needs to be reshaped from (,10) to (1,10)
        
        x_scaled = scaler.transform(X_unscaled)

        #Make a prediction from the scalled value

        encoded_predictions = reconstructed_model.predict_classes(x_scaled) #This gives an encoded prediction from 0-9
        print(encoded_predictions)
        
        
        prediction_labels = label_encoder.inverse_transform(encoded_predictions)
        pdb.set_trace()
        print(f'The predicted crime is: {prediction_labels[0]}')

        return 'Predicted Crime is:  %s' % prediction_labels[0]

    else:# GET message is send, and the server returns data
      #user = request.args.get('nm')
      #return redirect(url_for('success',name = user))
      return render_template('prediction.html')


if __name__ == "__main__":
    app.run(debug=True)
