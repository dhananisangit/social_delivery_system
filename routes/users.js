var mongo = require('./mongo')
var mongoURL = "mongodb://localhost:27017/social_delivery_system";

function login(req,res){
	mongo.connect(mongoURL, function(){
			var coll = mongo.collection('customerDetails');
			coll.findOne({emailID:req.body.emailID, password:req.body.password}, function(err, user){
				console.log(user)
				if(user){
					var result={"status":"200","name":user.Name};
					req.session.data={"userID":user.userID, "name":user.firstName + " " + user.lastName};
				}else{
					var result={"status":"400","msg":"Either email or password is incorrect"};
				}
				res.send(result)
			});
	});
}

exports.login = login;
