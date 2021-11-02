#!/bin/bash

rm $1
ssh -nNT -L $1:/cardano/data/ipc cardano-relay-1