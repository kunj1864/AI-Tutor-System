# check_accuracy.py

import numpy as np
from sklearn.linear_model import LogisticRegression
from sklearn.model_selection import train_test_split
from sklearn.metrics import accuracy_score, confusion_matrix, classification_report

X = np.array([
    [0, 0], [10, 1], [20, 1],       
    [30, 2], [40, 3], [50, 2],     
    [60, 4], [70, 5], [80, 5],      
    [90, 6], [100, 7],              
    [25, 1], [55, 3], [85, 6]       
])

# y = [0 = Fail, 1 = Pass]
y = np.array([0, 0, 0, 0, 0, 0, 1, 1, 1, 1, 1, 0, 0, 1]) 


X_train, X_test, y_train, y_test = train_test_split(X, y, test_size=0.2, random_state=42)

# 3. Train Model
model = LogisticRegression()
model.fit(X_train, y_train)


y_pred = model.predict(X_test)

# 5. Accuracy Calculate 
accuracy = accuracy_score(y_test, y_pred)

print("\n" + "="*40)
print(f"🎯 MODEL ACCURACY REPORT")
print("="*40)
print(f"✅ Accuracy Score: {accuracy * 100:.2f}%")
print("-" * 40)

# 6. Detail Report (Precision, Recall, F1-Score)
print("\n📊 Detailed Classification Report:")
print(classification_report(y_test, y_pred))

# 7. Confusion Matrix (Sahi vs Galat Prediction)
print("\n🧩 Confusion Matrix:")
print(confusion_matrix(y_test, y_pred))
print("(Row 1: Fail | Row 2: Pass)")
print("="*40 + "\n")