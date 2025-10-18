package main

import "time"

type IDGetSetter[T any] interface {
	GetID() uint64
	SetID(id uint64)
	*T
}

type ModelBase struct {
	ID uint64 `json:"id"`
}

func (m *ModelBase) GetID() uint64 {
	return m.ID
}

func (m *ModelBase) SetID(id uint64) {
	m.ID = id
}

type Token struct {
	ModelBase
	Token         string
	VoteAllowed   bool
	ResultAllowed bool
	VoteTimestamp *time.Time
}

type ClientVote struct {
	Token string           `json:"token"`
	Votes map[string][]int `json:"votes"`
}

type Vote struct {
	ModelBase
	TokenID  uint64
	Category string
	Image    int
	Score    int
}
