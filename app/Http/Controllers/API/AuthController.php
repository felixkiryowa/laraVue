<?php

namespace App\Http\Controllers\API;

use App\Http\Controllers\Controller;
use App\User;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Hash;
use Illuminate\Support\Facades\Validator;
use JWTAuth;
use Tymon\JWTAuth\Exceptions\JWTException;

class AuthController extends Controller
{
    public function authenticate(Request $request)
    {
        $credentials = $request->only('email', 'password');

        $user = User::where( 'email', $request->get('email'))->first();

        if($user) {
            $customlaims = ['names' => $user->name, 'user_id'=>$user->id, 'email'=>$user->email];
            try {

                if (! $token = JWTAuth::claims($customlaims)->attempt($credentials)) {
                    $validator->getMessageBag()->add('password', 'Wrong password');
                    return response()->json($validator->errors(), 400);
                }
            } catch (JWTException $e) {
                return response()->json(['error' => 'could_not_create_token'], 500);
            }
            $generatedToken = [
                'success' => true,
                'user' => [
                    'names' => $user->names,
                    'email' => $user->email,
                    'user_id'=>$user->id,
                ],
                'auth_token' => 'Bearer '. $token,
            ];

            return response()->json($generatedToken, 200);

        }else{
            try {

                if (!$token = JWTAuth::attempt($credentials)) {
                    $validator->getMessageBag()->add('phonenumber', 'Phone Number does not exist');
                    return response()->json($validator->errors(), 400);
                }
            } catch (JWTException $e) {
                return response()->json(['error' => 'could_not_create_token'], 500);
            }

        }

    }

    public function register(Request $request)
    {
        $validator = Validator::make($request->all(), [
            'name' => 'required|string|max:255',
            'email' => 'required|string|email|max:255|unique:users',
            'password' => 'required|string|min:6|confirmed',
            'password_confirmation' => 'required|string',
            'photo' => 'required|string',
            'type' => 'required',
            'bio' => 'required'
        ]);

        if ($validator->fails()) {
            return response()->json($validator->errors()->toJson(), 400);
        }

        $user = User::create([
            'name' => $request->get('name'),
            'email' => $request->get('email'),
            'password' => Hash::make($request->get('password')),
            'photo' => $request->photo,
            'type' => $request->type,
            'bio' => $request->bio
        ]);

        $token = JWTAuth::fromUser($user);

        return response()->json(compact('user', 'token'), 201);
    }

    public function getAuthenticatedUser()
    {
        try {

            if (!$user = JWTAuth::parseToken()->authenticate()) {
                return response()->json(['user_not_found'], 404);
            }

        } catch (Tymon\JWTAuth\Exceptions\TokenExpiredException $e) {

            return response()->json(['token_expired'], $e->getStatusCode());

        } catch (Tymon\JWTAuth\Exceptions\TokenInvalidException $e) {

            return response()->json(['token_invalid'], $e->getStatusCode());

        } catch (Tymon\JWTAuth\Exceptions\JWTException $e) {

            return response()->json(['token_absent'], $e->getStatusCode());

        }

        return response()->json(compact('user'));
    }
}
