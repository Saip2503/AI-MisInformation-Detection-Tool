from transformers import AutoTokenizer, AutoModel
tokenizer = AutoTokenizer.from_pretrained("distilbert-base-uncased")
model = AutoModel.from_pretrained("distilbert-base-uncased")
tokenizer.save_pretrained("./models/distilbert-base-uncased")
model.save_pretrained("./models/distilbert-base-uncased")
